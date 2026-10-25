import pytest
from fastapi.testclient import TestClient
from docx import Document
from io import BytesIO
from PIL import Image
import os

from backend.main import app
from backend.matcher import normalize_text, extract_skills_from_text, calculate_text_similarity, evaluate_candidate
from backend.parser import extract_text_from_docx, extract_text_from_image

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data

def test_text_normalization():
    raw = "  Python, FastAPI & Machine Learning! 100%  "
    norm = normalize_text(raw)
    assert "python" in norm
    assert "fastapi" in norm
    assert "machine learning" in norm
    assert "!" not in norm

def test_skill_extraction():
    text = "Experienced Senior Python Engineer with skills in FastAPI, Docker, PostgreSQL, and React. Strong leadership and Agile teamwork."
    skills = extract_skills_from_text(text)
    assert "python" in skills
    assert "fastapi" in skills
    assert "docker" in skills
    assert "postgresql" in skills
    assert "react" in skills
    assert "leadership" in skills
    assert "agile" in skills

def test_text_similarity():
    jd = "We are looking for a Python developer with FastAPI and PostgreSQL experience."
    resume_good = "Software engineer skilled in Python, FastAPI, and PostgreSQL databases."
    resume_bad = "Graphic designer proficient in Photoshop, Illustrator, and Figma."

    sim_good = calculate_text_similarity(jd, resume_good)
    sim_bad = calculate_text_similarity(jd, resume_bad)

    assert sim_good > sim_bad

def test_evaluate_candidate():
    jd = "Looking for Python, FastAPI, Docker, and PostgreSQL."
    resume = "Python developer with FastAPI, Docker, and PostgreSQL experience."

    eval_res = evaluate_candidate(jd, resume)
    assert "overall_score" in eval_res
    assert eval_res["overall_score"] > 50.0
    assert "python" in eval_res["matched_skills"]
    assert "explanation" in eval_res
    assert "disclaimer" in eval_res

def test_screen_endpoint_validation():
    # Missing job description
    response = client.post("/api/screen", data={})
    assert response.status_code == 422

    # Empty job description with dummy file
    doc = Document()
    doc.add_paragraph("Python developer resume.")
    bio = BytesIO()
    doc.save(bio)
    bio.seek(0)

    response = client.post(
        "/api/screen",
        data={"job_description": ""},
        files={"resumes": ("resume.docx", bio.read(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    )
    assert response.status_code in (400, 422)

def test_screen_endpoint_valid_docx():
    jd = "We need a Python developer with FastAPI and React experience."

    # Create sample docx 1 (Good match)
    doc1 = Document()
    doc1.add_paragraph("John Doe - Software Engineer")
    doc1.add_paragraph("Skills: Python, FastAPI, React, Docker, PostgreSQL.")
    bio1 = BytesIO()
    doc1.save(bio1)
    bio1.seek(0)

    # Create sample docx 2 (Partial/Low match)
    doc2 = Document()
    doc2.add_paragraph("Jane Smith - Marketing Specialist")
    doc2.add_paragraph("Skills: SEO, Content Writing, Photoshop.")
    bio2 = BytesIO()
    doc2.save(bio2)
    bio2.seek(0)

    response = client.post(
        "/api/screen",
        data={"job_description": jd},
        files=[
            ("resumes", ("john_resume.docx", bio1.read(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")),
            ("resumes", ("jane_resume.docx", bio2.read(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
        ]
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total_submitted"] == 2
    assert data["total_successfully_screened"] == 2
    candidates = data["candidates"]
    assert len(candidates) == 2
    assert candidates[0]["filename"] == "john_resume.docx"
    assert candidates[0]["rank"] == 1
    assert candidates[1]["rank"] == 2
    assert candidates[0]["overall_score"] > candidates[1]["overall_score"]

def test_extract_text_from_image():
    # Create a simple image with text
    img = Image.new('RGB', (200, 50), color=(255, 255, 255))
    # Note: Adding text to image via Pillow is complex, assume Tesseract can read a simple image if provided.
    # For this test, just ensure the function doesn't crash on valid image bytes
    bio = BytesIO()
    img.save(bio, format='PNG')
    bio.seek(0)

    # This might return empty string if no text is drawn, but should not raise exception
    text = extract_text_from_image(bio.read())
    assert isinstance(text, str)
