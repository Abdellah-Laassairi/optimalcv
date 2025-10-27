.PHONY: help install install-dev install-backend install-frontend clean test lint format docker-build docker-up docker-down deploy

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)OptimalCV - Makefile Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ==========================================
# Installation Commands
# ==========================================

install: install-backend install-frontend ## Install all dependencies

install-backend: ## Install backend dependencies
	@echo "$(BLUE)Installing backend dependencies...$(NC)"
	cd backend && pip install -e ".[dev]"

install-frontend: ## Install frontend dependencies
	@echo "$(BLUE)Installing frontend dependencies...$(NC)"
	cd frontend && npm install

install-dev: install ## Install all dependencies including dev tools
	@echo "$(BLUE)Installing pre-commit hooks...$(NC)"
	pip install pre-commit
	pre-commit install --install-hooks
	@echo "$(GREEN)✓ All dependencies installed$(NC)"
	@echo "$(GREEN)✓ Pre-commit hooks installed$(NC)"

# ==========================================
# Development Commands
# ==========================================

dev-backend: ## Run backend in development mode
	@echo "$(BLUE)Starting backend server...$(NC)"
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Run frontend in development mode
	@echo "$(BLUE)Starting frontend server...$(NC)"
	cd frontend && npm run dev

dev: ## Run both backend and frontend in development mode
	@echo "$(BLUE)Starting development servers...$(NC)"
	@trap 'kill 0' EXIT; \
	(cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000) & \
	(cd frontend && npm run dev)

# ==========================================
# Testing Commands
# ==========================================

test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests
	@echo "$(BLUE)Running backend tests...$(NC)"
	cd backend && pytest

test-frontend: ## Run frontend tests
	@echo "$(BLUE)Running frontend tests...$(NC)"
	cd frontend && npm test

test-cov: ## Run tests with coverage
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	cd backend && pytest --cov=app --cov-report=html --cov-report=term
	@echo "$(GREEN)✓ Coverage report generated in backend/htmlcov/$(NC)"

# ==========================================
# Code Quality Commands
# ==========================================

lint: lint-backend lint-frontend ## Run all linters

lint-backend: ## Lint backend code
	@echo "$(BLUE)Linting backend...$(NC)"
	cd backend && flake8 app

lint-frontend: ## Lint frontend code
	@echo "$(BLUE)Linting frontend...$(NC)"
	cd frontend && npm run lint

format: format-backend format-frontend ## Format all code

format-backend: ## Format backend code
	@echo "$(BLUE)Formatting backend code...$(NC)"
	cd backend && black app && isort app
	@echo "$(GREEN)✓ Backend code formatted$(NC)"

format-frontend: ## Format frontend code
	@echo "$(BLUE)Formatting frontend code...$(NC)"
	cd frontend && npx prettier --write src/
	@echo "$(GREEN)✓ Frontend code formatted$(NC)"

type-check: ## Run type checking
	@echo "$(BLUE)Running type checks...$(NC)"
	cd backend && mypy app --ignore-missing-imports
	cd frontend && npx tsc --noEmit

# ==========================================
# Build Commands
# ==========================================

build: build-backend build-frontend ## Build all components

build-backend: ## Build backend package
	@echo "$(BLUE)Building backend package...$(NC)"
	cd backend && python -m build
	@echo "$(GREEN)✓ Backend package built$(NC)"

build-frontend: ## Build frontend for production
	@echo "$(BLUE)Building frontend...$(NC)"
	cd frontend && npm run build
	@echo "$(GREEN)✓ Frontend built$(NC)"

# ==========================================
# Docker Commands
# ==========================================

docker-build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose build
	@echo "$(GREEN)✓ Docker images built$(NC)"

docker-up: ## Start Docker containers
	@echo "$(BLUE)Starting Docker containers...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Containers started$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"

docker-down: ## Stop Docker containers
	@echo "$(BLUE)Stopping Docker containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Containers stopped$(NC)"

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-clean: ## Remove Docker containers and volumes
	@echo "$(YELLOW)Cleaning Docker resources...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)✓ Docker resources cleaned$(NC)"

# ==========================================
# Cleanup Commands
# ==========================================

clean: ## Clean build artifacts and cache
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "build" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	rm -rf frontend/node_modules
	rm -rf frontend/dist
	rm -rf backend/htmlcov
	rm -rf backend/.coverage
	@echo "$(GREEN)✓ Cleaned$(NC)"

# ==========================================
# Deployment Commands
# ==========================================

deploy-check: ## Check if ready for deployment
	@echo "$(BLUE)Running deployment checks...$(NC)"
	@echo "Checking backend..."
	cd backend && pytest
	@echo "Checking frontend..."
	cd frontend && npm run build
	@echo "$(GREEN)✓ Deployment checks passed$(NC)"

publish-backend: ## Publish backend to PyPI
	@echo "$(YELLOW)Publishing to PyPI...$(NC)"
	cd backend && python -m build
	cd backend && twine check dist/*
	cd backend && twine upload dist/*
	@echo "$(GREEN)✓ Published to PyPI$(NC)"

# ==========================================
# Documentation Commands
# ==========================================

docs: ## Generate documentation
	@echo "$(BLUE)Generating documentation...$(NC)"
	mkdocs build
	@echo "$(GREEN)✓ Documentation generated in site/$(NC)"

docs-serve: ## Serve documentation locally
	@echo "$(BLUE)Serving documentation at http://127.0.0.1:8000$(NC)"
	mkdocs serve

docs-deploy: ## Deploy documentation to GitHub Pages
	@echo "$(BLUE)Deploying documentation to GitHub Pages...$(NC)"
	mkdocs gh-deploy --force
	@echo "$(GREEN)✓ Documentation deployed$(NC)"

# ==========================================
# Utility Commands
# ==========================================

setup: install ## Complete setup for first-time users
	@echo "$(BLUE)Running initial setup...$(NC)"
	cp env.example .env
	@echo "$(YELLOW)⚠ Don't forget to edit .env with your API keys$(NC)"
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Edit .env file with your API keys"
	@echo "  2. Run 'make dev' to start development servers"

pre-commit: ## Run pre-commit on all files
	@echo "$(BLUE)Running pre-commit hooks...$(NC)"
	pre-commit run --all-files

pre-commit-update: ## Update pre-commit hooks
	@echo "$(BLUE)Updating pre-commit hooks...$(NC)"
	pre-commit autoupdate

check: lint type-check test pre-commit ## Run all checks (lint, type-check, test, pre-commit)
	@echo "$(GREEN)✓ All checks passed!$(NC)"

health: ## Check health of running services
	@echo "$(BLUE)Checking service health...$(NC)"
	@curl -f http://localhost:8000/health && echo "$(GREEN)✓ Backend healthy$(NC)" || echo "$(YELLOW)✗ Backend not responding$(NC)"
	@curl -f http://localhost:3000/health && echo "$(GREEN)✓ Frontend healthy$(NC)" || echo "$(YELLOW)✗ Frontend not responding$(NC)"
