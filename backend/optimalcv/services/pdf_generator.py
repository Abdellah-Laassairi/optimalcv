"""PDF generation from LaTeX source."""

import shutil
import subprocess
import tempfile
from typing import Any

from loguru import logger


def compile_latex_to_pdf(latex_source: str, output_dir: str) -> str:
    """Compile LaTeX source to a PDF file."""
    logger.info(f"Compiling LaTeX to PDF in {output_dir}")
    tex_path = f"{output_dir}/cv.tex"
    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(latex_source)

    cmd = ["pdflatex", "-interaction=nonstopmode", f"-output-directory={output_dir}", tex_path]
    logger.info(f"Running command: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)

    if result.returncode != 0:
        logger.error(f"LaTeX compilation failed with exit code {result.returncode}")
        logger.error(f"pdflatex stdout:\n{result.stdout}")
        logger.error(f"pdflatex stderr:\n{result.stderr}")
        raise PDFGenerationError("LaTeX compilation failed", result.stdout)

    pdf_path = f"{output_dir}/cv.pdf"
    logger.info(f"PDF successfully generated at {pdf_path}")
    return pdf_path


class PDFGenerationError(Exception):
    """Custom exception for PDF generation errors."""

    def __init__(self, message: str, logs: str | None = None):
        """Initialize the exception."""
        super().__init__(message)
        self.logs = logs


def check_latex_installation() -> dict[str, Any]:
    """Check if a LaTeX distribution is installed and available."""
    logger.info("Checking for LaTeX installation...")
    try:
        result = subprocess.run(["pdflatex", "-version"], capture_output=True, text=True, check=True)
        version_line = result.stdout.splitlines()[0]
        logger.info(f"LaTeX is installed: {version_line}")
        return {"installed": True, "version": version_line}
    except (FileNotFoundError, subprocess.CalledProcessError):
        logger.warning("LaTeX installation not found")
        return {"installed": False, "version": None}


def generate_cv_pdf(latex_source: str) -> bytes:
    """Generate a CV PDF from a LaTeX string."""
    logger.info(f"Generating PDF from LaTeX source ({len(latex_source)} characters)")
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            pdf_path = compile_latex_to_pdf(latex_source, temp_dir)
            with open(pdf_path, "rb") as f:
                pdf_content = f.read()
            logger.info(f"PDF generated successfully ({len(pdf_content)} bytes)")
            return pdf_content
        except PDFGenerationError as e:
            logger.error(f"PDF generation failed: {e.logs}")
            raise
        finally:
            if shutil.which("rm"):
                subprocess.run(["rm", "-rf", temp_dir], check=False)
