#!/bin/bash
# AutoCV Backend Server Launcher

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   OptimalCV Backend Server${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if we're in the backend directory
if [ ! -f "optimalcv/main.py" ]; then
  echo -e "${RED}Error: optimalcv/main.py not found${NC}"
  echo -e "${RED}Please run this script from the backend directory${NC}"
  exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✓${NC} Python version: $PYTHON_VERSION"

# Check if virtual environment exists
if [ ! -d "venv" ] && [ ! -d "../venv" ] && [ -z "$VIRTUAL_ENV" ]; then
  echo -e "${YELLOW}⚠${NC}  No virtual environment detected"
  echo -e "   Consider creating one: python3 -m venv venv && source venv/bin/activate"
  echo ""
fi

# Check if dependencies are installed
if ! python3 -c "import fastapi" 2>/dev/null; then
  echo -e "${YELLOW}⚠${NC}  FastAPI not installed"
  echo -e "   Run: pip install -r requirements.txt"
  echo ""
fi

# Check LaTeX installation (optional for PDF generation)
if command -v pdflatex &>/dev/null; then
  LATEX_VERSION=$(pdflatex --version 2>&1 | head -n 1)
  echo -e "${GREEN}✓${NC} LaTeX installed: $LATEX_VERSION"
else
  echo -e "${YELLOW}⚠${NC}  LaTeX not installed (PDF generation will not work)"
  echo -e "   Run: ./install_latex.sh"
fi

echo ""
echo -e "${BLUE}Starting server...${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "API Documentation: ${GREEN}http://localhost:8000/docs${NC}"
echo -e "Health Check:      ${GREEN}http://localhost:8000/health${NC}"
echo -e "LaTeX Status:      ${GREEN}http://localhost:8000/health/latex${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Run the server
cd optimalcv
echo -e "${GREEN}Starting backend server...${NC}"
echo "Access the API documentation at http://localhost:8000/docs"

# Export PYTHONPATH
export PYTHONPATH
PYTHONPATH="${PWD}:${PYTHONPATH}"

# Start server
uvicorn optimalcv.main:app --reload --host 0.0.0.0 --port 8000
