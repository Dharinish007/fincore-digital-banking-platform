from fastapi import FastAPI, UploadFile, File
from PIL import Image
import pytesseract
import io

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
app = FastAPI(title="FinCore OCR Service")


@app.get("/")
def health_check():
    return {
        "status": "UP",
        "message": "FinCore Python OCR service is running"
    }


@app.post("/ocr")
async def perform_ocr(document: UploadFile = File(...)):

    file_bytes = await document.read()

    image = Image.open(io.BytesIO(file_bytes))

    extracted_text = pytesseract.image_to_string(image)

    data = pytesseract.image_to_data(
        image,
        output_type=pytesseract.Output.DICT
    )

    confidences = []

    for confidence in data["conf"]:
        try:
            value = float(confidence)
            if value >= 0:
                confidences.append(value)
        except ValueError:
            pass

    confidence_score = (
        sum(confidences) / len(confidences)
        if confidences
        else 0.0
    )

    return {
        "extractedRawText": extracted_text.strip(),
        "confidenceScore": round(confidence_score, 2)
    }