import os
from io import BytesIO
from pypdf import PdfReader
from docx import Document
from PIL import Image
import pytesseract

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

# Configure Tesseract OCR for Windows and Linux
if os.name == "nt":
    TESSERACT_PATH = os.environ.get(
        "TESSERACT_PATH",
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    )
else:
    TESSERACT_PATH = os.environ.get(
        "TESSERACT_PATH",
        "/usr/bin/tesseract",
    )

pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF bytes using pypdf."""
    try:
        reader = PdfReader(BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX bytes using python-docx."""
    try:
        doc = Document(BytesIO(file_bytes))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs if paragraph.text])
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to parse DOCX: {str(e)}")


def extract_text_from_image(file_bytes: bytes) -> str:
    """Extract text from image bytes (JPG/JPEG/PNG) using Tesseract OCR."""
    try:
        img = Image.open(BytesIO(file_bytes))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to parse image: {str(e)}")


def extract_resume_text(filename: str, file_bytes: bytes) -> str:
    """Validate file size, extension and extract text based on format."""
    if len(file_bytes) > MAX_FILE_SIZE:
        raise ValueError(f"File '{filename}' exceeds maximum allowed size of 5MB.")

    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_bytes)
    elif ext == ".docx":
        return extract_text_from_docx(file_bytes)
    elif ext in [".jpg", ".jpeg", ".png"]:
        return extract_text_from_image(file_bytes)
    else:
        raise ValueError(
            f"Unsupported file extension '{ext}' for file '{filename}'. Allowed: .pdf, .docx, .jpg, .jpeg, .png"
        )
