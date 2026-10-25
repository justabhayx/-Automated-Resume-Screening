# NEXUS AI

Automated Resume Screening application.

## Setup Instructions (Windows PowerShell)

1. Create a virtual environment:
   `python -m venv venv`

2. Activate the virtual environment:
   `.\venv\Scripts\Activate.ps1`

3. Install dependencies:
   `pip install -r backend/requirements.txt`

4. Run the backend:
   `uvicorn backend.main:app --reload`

5. The API will be available at:
   - `http://localhost:8000` (welcome message)
   - `http://localhost:8000/api/health` (health check)
   - `http://localhost:8000/docs` (interactive API documentation)
