"""AI-powered CV content generation."""

import os
import re
from typing import Any, Optional

import yaml
from loguru import logger
from openai import OpenAI

from app.services.scraper import JobInfo
from app.services.settings import get_settings

# Load prompts
PROMPTS_PATH = os.path.join(os.path.dirname(__file__), "..", "resources", "prompts.yaml")
with open(PROMPTS_PATH) as f:
    PROMPTS = yaml.safe_load(f)

# AI client
client: Optional[OpenAI] = None


def get_client() -> OpenAI:
    """Get OpenAI client."""
    global client
    if client is None:
        settings = get_settings()
        client = OpenAI(api_key=settings.api_key, base_url=settings.base_url)
    return client


def generate_cv_latex(user_description: str, job: JobInfo) -> str:
    """Generate a CV in LaTeX format."""
    logger.info("Starting CV generation process...")

    # Stage 1: Content Generation
    logger.info("Stage 1: Generating CV content...")
    prompt_stage1 = build_prompt(
        PROMPTS["cv_content_generation_prompt"],
        user_description=user_description,
        job_description=job.description,
        job_title=job.title,
    )
    content = call_ai_for_latex(prompt_stage1, PROMPTS["cv_system_prompt"])

    # Stage 2: HR Review
    logger.info("Stage 2: Reviewing CV content...")
    prompt_stage2 = build_prompt(PROMPTS["cv_hr_review_prompt"], cv_text=content)
    reviewed_content = call_ai_for_latex(prompt_stage2, PROMPTS["cv_system_prompt"])

    # Stage 3: Final LaTeX Generation
    logger.info("Stage 3: Generating final LaTeX...")
    final_content = fix_latex_issues(reviewed_content)

    logger.info("CV generation process completed.")
    return final_content


def fix_latex_issues(latex_code: str) -> str:
    """Fix common LaTeX issues in the generated code."""
    # Remove ```latex and ``` wrappers
    latex_code = re.sub(r"```latex\s*", "", latex_code)
    latex_code = re.sub(r"```", "", latex_code)

    # Escape special characters
    latex_code = latex_code.replace("&", r"\&")
    latex_code = latex_code.replace("%", r"\%")
    latex_code = latex_code.replace("$", r"\$")
    latex_code = latex_code.replace("#", r"\#")
    latex_code = latex_code.replace("_", r"\_")
    latex_code = latex_code.replace("{", r"\{")
    latex_code = latex_code.replace("}", r"\}")

    return latex_code.strip()


def build_prompt(template: str, **kwargs: Any) -> str:
    """Build a prompt from a template and keyword arguments."""
    for key, value in kwargs.items():
        template = template.replace(f"{{{key}}}", str(value))
    return template


def call_ai_for_latex(prompt: str, system_prompt: str) -> str:
    """Call the AI model and return the response."""
    logger.info("Calling AI model...")
    settings = get_settings()
    local_client = get_client()

    try:
        response = local_client.chat.completions.create(
            model=settings.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=settings.temperature,
            max_tokens=settings.max_tokens,
        )
        content = response.choices[0].message.content
        if not content:
            raise ValueError("AI returned empty response")
        logger.info("AI call successful.")
        return content
    except Exception as e:
        logger.error(f"AI call failed: {e}")
        raise
