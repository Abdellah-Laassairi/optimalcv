# Contributing to AutoCV

Thank you for your interest in contributing to AutoCV!

**📖 Full Contributing Guide**: [docs/development/contributing-guide.md](docs/development/contributing-guide.md)

This file has been moved to the documentation folder. Please refer to the link above for complete contribution guidelines.

## Quick Links

- **[Contributing Guide](docs/development/contributing-guide.md)** - Complete guidelines
- **[Pre-commit Hooks](docs/development/pre-commit-guide.md)** - Code quality setup
- **[Development Setup](docs/getting-started/quickstart.md)** - Getting started
- **[Repository Status](docs/development/repository-status.md)** - Quality report

## Quick Start

```bash
# 1. Fork and clone
git clone https://github.com/yourusername/optimalcv.git
cd optimalcv

# 2. Install dev dependencies
pip install -e ".[dev]"
cd frontend && npm install

# 3. Setup pre-commit hooks
pre-commit install

# 4. Make your changes and commit
git checkout -b feature/my-feature
# ... make changes ...
git commit -m "feat: add new feature"

# 5. Push and create PR
git push origin feature/my-feature
```

See the [full guide](docs/development/contributing-guide.md) for more details!
