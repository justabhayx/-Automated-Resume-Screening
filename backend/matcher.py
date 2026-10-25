import re
from typing import List, Dict, Set, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Curated Skill Taxonomy
SKILL_TAXONOMY = {
    "programming_languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
        "ruby", "php", "sql", "bash", "shell", "swift", "kotlin", "scala"
    ],
    "web_frameworks": [
        "react", "node.js", "fastapi", "flask", "django", "spring boot", "angular",
        "vue.js", "express", "next.js", "tailwind", "bootstrap", "graphql", "rest api"
    ],
    "databases_and_storage": [
        "postgresql", "mysql", "mongodb", "redis", "sqlite", "dynamodb",
        "cassandra", "oracle", "elasticsearch", "postgresql", "firebase"
    ],
    "ai_ml_data": [
        "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy", "nlp",
        "llm", "computer vision", "data analysis", "machine learning", "deep learning",
        "hugging face", "opencv", "langchain"
    ],
    "devops_cloud": [
        "docker", "kubernetes", "aws", "azure", "gcp", "git", "ci/cd",
        "linux", "terraform", "jenkins", "github actions", "ansible", "docker-compose"
    ],
    "soft_skills": [
        "leadership", "communication", "problem solving", "agile", "scrum",
        "teamwork", "project management", "critical thinking", "collaboration",
        "time management", "adaptability"
    ]
}

def flatten_taxonomy() -> Set[str]:
    """Flatten skill taxonomy into a single set of lowercase skill strings."""
    skills = set()
    for category, items in SKILL_TAXONOMY.items():
        for item in items:
            skills.add(item.lower())
    return skills

ALL_SKILLS = flatten_taxonomy()

def normalize_text(text: str) -> str:
    """Normalize text by lowercasing and cleaning whitespace/punctuation."""
    if not text:
        return ""
    text = text.lower()
    # Keep alphanumeric, spaces, and common separators
    text = re.sub(r'[^a-z0-9\+\#\.\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_skills_from_text(text: str) -> List[str]:
    """Extract known skills from text using word boundary matching against taxonomy."""
    normalized = normalize_text(text)
    found_skills = set()

    for skill in ALL_SKILLS:
        # Escape special characters like c++, c#, node.js
        escaped_skill = re.escape(skill)
        # Check word boundaries or symbol-safe boundaries
        pattern = r'(?<![a-z0-9])' + escaped_skill + r'(?![a-z0-9])'
        if re.search(pattern, normalized):
            found_skills.add(skill)

    return sorted(list(found_skills))

def calculate_text_similarity(job_desc: str, resume_text: str) -> float:
    """Calculate TF-IDF cosine similarity between job description and resume text."""
    if not job_desc.strip() or not resume_text.strip():
        return 0.0

    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([job_desc, resume_text])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(max(0.0, min(1.0, similarity)))
    except Exception:
        # Fallback if vectorizer fails on empty vocab
        return 0.0

def evaluate_candidate(job_description: str, resume_text: str) -> Dict:
    """Evaluate candidate resume against job description."""
    norm_jd = normalize_text(job_description)
    norm_resume = normalize_text(resume_text)

    jd_skills = set(extract_skills_from_text(job_description))
    resume_skills = set(extract_skills_from_text(resume_text))

    # If no skills mentioned in JD, use all extracted resume skills or general fallback
    target_skills = jd_skills if jd_skills else resume_skills

    matched_skills = sorted(list(resume_skills.intersection(target_skills)))
    missing_skills = sorted(list(target_skills - resume_skills))

    # Skill coverage ratio
    if target_skills:
        skill_coverage = len(matched_skills) / len(target_skills)
    else:
        skill_coverage = 1.0 if resume_skills else 0.5

    # Text similarity (0.0 to 1.0)
    text_similarity = calculate_text_similarity(job_description, resume_text)

    # Weighted Score (70% text similarity, 30% skill coverage) -> scaled to 0-100
    score = (0.70 * (text_similarity * 100)) + (0.30 * (skill_coverage * 100))
    score = round(float(max(0.0, min(100.0, score))), 2)

    return {
        "overall_score": score,
        "text_similarity_score": round(float(text_similarity * 100), 2),
        "skill_coverage_score": round(float(skill_coverage * 100), 2),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "extracted_skills": sorted(list(resume_skills)),
        "explanation": {
            "strengths": f"Demonstrated proficiency in {len(matched_skills)} key skills including {', '.join(matched_skills[:5]) if matched_skills else 'general technical areas'}.",
            "skill_gaps": f"Missing {len(missing_skills)} target skills: {', '.join(missing_skills[:5]) if missing_skills else 'none identified'}.",
            "summary": f"Overall relevance score of {score}% derived from {round(text_similarity*100, 1)}% semantic text match and {round(skill_coverage*100, 1)}% skill taxonomy coverage."
        },
        "disclaimer": "Decision-support estimate only. Not a prediction of job performance or automatic hiring decision."
    }
