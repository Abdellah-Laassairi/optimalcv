"""FastAPI application for AutoCV."""

<<<<<<< HEAD
import os
=======
>>>>>>> 69c9dd2103c51c4951896efb5db51373d90579e7
from typing import Annotated, Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response

from app.services.generator import generate_cv_latex
from app.services.pdf_generator import generate_cv_pdf
from app.services.scraper import JobInfo, scrape_job_url
from app.services.settings import AISettings, get_settings, update_settings

app = FastAPI(
    title="AutoCV API",
    description="AI-powered CV generation with multi-stage optimization.",
    version="1.0.0",
)

<<<<<<< HEAD
# Get CORS origins from environment variable
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")
cors_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
=======
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
>>>>>>> 69c9dd2103c51c4951896efb5db51373d90579e7
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/api/settings", response_model=AISettings)
async def get_current_settings():
    """Get current AI settings."""
    return get_settings()


@app.post("/api/settings", response_model=AISettings)
async def set_settings(settings: AISettings):
    """Update AI settings."""
    return update_settings(settings.dict())


@app.post("/api/generate")
async def generate(
    job_url: Annotated[Optional[str], Form()] = None,
    job_text: Annotated[Optional[str], Form()] = None,
    profile_file: Annotated[Optional[UploadFile], File()] = None,
    profile_text: Annotated[Optional[str], Form()] = None,
):
    """Generate a CV from a job posting and user profile."""
    if not job_url and not job_text:
        raise HTTPException(status_code=400, detail="Job URL or text must be provided.")
    if not profile_file and not profile_text:
        raise HTTPException(status_code=400, detail="Profile file or text must be provided.")

    try:
        if job_url:
            job = scrape_job_url(job_url)
        else:
            job = JobInfo.from_text(job_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process job information: {e}")

    try:
        if profile_file and profile_file.file:
            user_description = profile_file.file.read().decode("utf-8")
        else:
            user_description = profile_text or ""
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process profile: {e}")

    try:
        latex_cv = generate_cv_latex(user_description, job)
        pdf_bytes = generate_cv_pdf(latex_cv)
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate CV: {e}")
