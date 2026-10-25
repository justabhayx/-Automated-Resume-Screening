Made the NEXUS AI backend available locally in a consolidated README section

## Core Setup

### Project Structure
- `backend/`: Python FastAPI application
- `frontend/`: React/Vite UI (to be developed in Stage 2)
- `storage/resumes/`: Resume PDF/DOCX files
- `tests/`: Python and frontend tests
- `docs/`: Architecture and development documentation

### Python Backend (FastAPI)
- File: `backend/main.py`
- API Endpoints:
  - `GET /` – Welcome message
  - `GET /api/health` – Application health status
- Requirements: `fastapi`, `uvicorn`

### Development Commands (Windows PowerShell)

1. **Set up virtual environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

2. **Install dependencies**:
   ```powershell
   pip install -r backend/requirements.txt
   ```

3. **Run the backend**:
   ```powershell
   uvicorn backend.main:app --reload
   ```

4. **Verify the API**:
   - Health endpoint: `http://localhost:8000/api/health`
   - Welcome endpoint: `http://localhost:8000/`

### Stage 2 Planned Enhancements
- Implement Resume Upload & Parsing (PDF/DOCX)
- Build NLP/ML Engine (Skill Extraction, Semantic Matching)
- Build Explainable Candidate Ranking System
- Develop Premium Futuristic Frontend Dashboard

### Local Deployment
- Use FastAPI with Uvicorn for async, low-latency processing
- Leverage NVIDIA GeForce RTX 2050 GPU for local ML acceleration
- Zero paid API costs through native FastAPI and local NLP models

Co-Authored-By: Claude Code <noreply@anthropic.com>
