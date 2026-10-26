from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os

from backend.parser import extract_resume_text
from backend.matcher import evaluate_candidate, extract_skills_from_text

app = FastAPI(
    title="NEXUS AI - Automated Resume Screening API",
    version="0.2.0",
    description="AI-powered automated resume screening and candidate ranking backend."
)

# Configure CORS for production (Vercel frontend) and local development
cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://automated-resume-screening-six.vercel.app",
    "https://automated-resume-screening-git-main-justabhayx.vercel.app"
]

# If a specific frontend URL is provided via environment variable, add it
frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url:
    cors_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to NEXUS AI API - Automated Resume Screening",
        "version": "0.2.0",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "0.2.0"}

@app.post("/api/screen")
async def screen_resumes(
    job_description: str = Form(...),
    resumes: List[UploadFile] = File(...)
):
    """
    Screen multiple resume files (PDF, DOCX) against a job description.
    Extracts text, matches skills, calculates TF-IDF cosine similarity,
    computes weighted scores, ranks candidates, and returns explainable results.
    """
    if not job_description or not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required and cannot be empty.")

    if not resumes:
        raise HTTPException(status_code=400, detail="At least one resume file must be provided.")

    candidates_results = []
    errors = []

    for upload_file in resumes:
        filename = upload_file.filename or "unknown_file"
        try:
            file_bytes = await upload_file.read()
            # Extract text with validation
            resume_text = extract_resume_text(filename, file_bytes)

            if not resume_text or len(resume_text) < 20:
                errors.append({
                    "filename": filename,
                    "error": "Extracted text is empty or too short to process."
                })
                continue

            # Evaluate candidate
            evaluation = evaluate_candidate(job_description, resume_text)

            candidates_results.append({
                "filename": filename,
                "overall_score": evaluation["overall_score"],
                "text_similarity": evaluation["text_similarity_score"],
                "skill_coverage": evaluation["skill_coverage_score"],
                "matched_skills": evaluation["matched_skills"],
                "missing_skills": evaluation["missing_skills"],
                "extracted_skills": evaluation["extracted_skills"],
                "explanation": evaluation["explanation"],
                "disclaimer": evaluation["disclaimer"]
            })

        except Exception as e:
            errors.append({
                "filename": filename,
                "error": str(e)
            })

    # Sort candidates by overall_score descending
    candidates_results.sort(key=lambda x: x["overall_score"], reverse=True)

    # Assign ranks
    for rank, candidate in enumerate(candidates_results, start=1):
        candidate["rank"] = rank

    jd_skills = extract_skills_from_text(job_description)

    return {
        "job_description_summary": {
            "length_characters": len(job_description),
            "extracted_target_skills": jd_skills
        },
        "total_submitted": len(resumes),
        "total_successfully_screened": len(candidates_results),
        "total_errors": len(errors),
        "candidates": candidates_results,
        "errors": errors
    }
