"""Web scraper for extracting job posting information from URLs."""

import requests
from bs4 import BeautifulSoup
from pydantic import BaseModel


class JobInfo(BaseModel):
    """Represent the extracted information from a job posting."""

    title: str
    company: str
    description: str
    requirements: list[str]


def scrape_job_url(url: str) -> JobInfo:
    """Scrape a job posting URL and return a JobInfo object."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # Simple extraction logic (can be improved with provider-specific selectors)
        title = soup.find("h1").get_text(strip=True) if soup.find("h1") else "N/A"
        company = (
            soup.find("a", class_="topcard__org-name-link").get_text(strip=True)
            if soup.find("a", class_="topcard__org-name-link")
            else "N/A"
        )
        description = (
            soup.find("div", class_="description__text").get_text()
            if soup.find("div", class_="description__text")
            else "N/A"
        )
        requirements = [li.get_text(strip=True) for li in soup.select(".description__job-criteria-list li")]

        return JobInfo(
            title=title,
            company=company,
            description=description,
            requirements=requirements,
        )
    except requests.RequestException as e:
        raise RuntimeError(f"Failed to fetch URL: {e}")
    except Exception as e:
        raise RuntimeError(f"Failed to parse job posting: {e}")
