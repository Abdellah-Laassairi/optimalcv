"""AutoCV application package."""

from .services.generator import generate_cv_latex
from .services.pdf_generator import generate_cv_pdf
from .services.scraper import JobInfo, scrape_job_url

__all__ = ["generate_cv_latex", "generate_cv_pdf", "scrape_job_url", "JobInfo"]
