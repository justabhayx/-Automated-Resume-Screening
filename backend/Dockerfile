# syntax=docker/dockerfile:1
FROM python:3.11-slim

# Set a working directory
WORKDIR /app

# Install system dependencies for image parsing (Tesseract OCR, Pillow, poppler-utils)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libtesseract-dev \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY . .

# Run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]