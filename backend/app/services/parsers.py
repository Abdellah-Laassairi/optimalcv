"""Parsers for handling different input file formats."""

import markdown
from bs4 import BeautifulSoup
from pypdf import PdfReader


def parse_pdf_bytes(pdf_bytes: bytes) -> str:
    """Parse a PDF file from bytes and return its text content."""
    import io

    reader = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


def parse_markdown_text(markdown_text: str) -> str:
    """Parse a markdown string and return its text content."""
    html = markdown.markdown(markdown_text)
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text()
