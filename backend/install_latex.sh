#!/bin/bash
# Install LaTeX dependencies for PDF generation

echo "Installing LaTeX (TeX Live)..."
echo "This may take several minutes..."

# Update package list
sudo apt-get update

# Install TeX Live with required packages
sudo apt-get install -y \
  texlive-latex-base \
  texlive-fonts-recommended \
  texlive-fonts-extra \
  texlive-latex-extra

# Verify installation
if command -v pdflatex &>/dev/null; then
  echo ""
  echo "✅ LaTeX installed successfully!"
  echo ""
  pdflatex --version | head -n 1
  echo ""
  echo "You can now use the /api/generate-pdf endpoint"
else
  echo ""
  echo "❌ LaTeX installation failed"
  echo "Please install manually: sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-latex-extra"
  exit 1
fi
