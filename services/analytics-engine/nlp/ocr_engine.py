import os
import shutil
from typing import Dict, Any, Union
from PIL import Image, ImageEnhance, ImageFilter
try:
    import pytesseract

    # Configure Tesseract binary path
    TESSERACT_CMD = os.getenv("TESSERACT_CMD")
    if not TESSERACT_CMD:
        TESSERACT_CMD = shutil.which("tesseract") or "/opt/homebrew/bin/tesseract"

    if TESSERACT_CMD and os.path.exists(TESSERACT_CMD):
        pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
except ImportError:
    pytesseract = None

def preprocess_image_for_ocr(image: Image.Image) -> Image.Image:
    """
    Applies standard contrast enhancement, grayscale conversion, and thresholding
    optimized for bilingual Devanagari and Latin script recognition.
    """
    # 1. Convert to grayscale
    gray = image.convert("L")

    # 2. Enhance contrast
    enhancer = ImageEnhance.Contrast(gray)
    contrasted = enhancer.enhance(2.0)

    # 3. Simple high-speed adaptive binary threshold
    threshold = 140
    bw = contrasted.point(lambda p: 255 if p > threshold else 0)
    
    return bw

def extract_bilingual_text_from_image(
    image_input: Union[str, Image.Image],
    lang: str = "hin+eng",
    psm: int = 6
) -> Dict[str, Any]:
    """
    Runs bilingual OCR using Tesseract for MoSPI circulars, field return receipts,
    and survey schedules.
    """
    try:
        if isinstance(image_input, str):
            if not os.path.exists(image_input):
                return {
                    "text": "",
                    "method": "ocr_bilingual_tesseract",
                    "status": "error",
                    "error": f"File not found: {image_input}"
                }
            image = Image.open(image_input)
        else:
            image = image_input

        if pytesseract is None:
            return {
                "text": "",
                "method": "ocr_bilingual_tesseract",
                "status": "fallback",
                "error": "pytesseract library is not installed"
            }

        # Preprocessing
        preprocessed = preprocess_image_for_ocr(image)

        # Extraction
        config = f"--psm {psm}"
        raw_text = pytesseract.image_to_string(preprocessed, lang=lang, config=config)
        cleaned_text = "\n".join([line.strip() for line in raw_text.splitlines() if line.strip()])

        # Detect presence of Devanagari Unicode range (U+0900 to U+097F)
        has_devanagari = any("\u0900" <= ch <= "\u097f" for ch in cleaned_text)

        return {
            "text": cleaned_text,
            "char_count": len(cleaned_text),
            "has_devanagari": has_devanagari,
            "languages_used": lang,
            "method": "ocr_bilingual_tesseract",
            "status": "success"
        }
    except Exception as exc:
        return {
            "text": "",
            "method": "ocr_bilingual_tesseract",
            "status": "fallback",
            "error": str(exc)
        }
