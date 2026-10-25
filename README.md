# NEXUS AI
Automated Resume Screening & Candidate Ranking Application.

## 📋 Setup & Installation

### Backend
1. **Create virtual environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
2. **Install dependencies**:
   ```powershell
   pip install -r backend/requirements.txt
   ```
3. **Run the FastAPI backend server**:
   ```powershell
   uvicorn backend.main:app --reload --port 8000
   ```
   *Note: For image OCR, ensure Tesseract OCR is installed at `C:\Program Files\Tesseract-OCR\tesseract.exe`.*

### Frontend
1. **Install dependencies**:
   ```powershell
   cd frontend
   npm install
   ```
2. **Run the development server**:
   ```powershell
   npm run dev
   ```
   Access at `http://localhost:3000`.

### Render Deployment
To deploy on Render:
1. Use the root directory as the build context.
2. **Build Command**: `pip install -r backend/requirements.txt`
3. **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Set environment variable `TESSERACT_PATH` if needed (Render handles OCR via `apt-get install tesseract-ocr` in a Dockerfile).
