from fastapi import FastAPI

from ocr_service import router as ocr_router
from face_service import router as face_router
from liveness import router as liveness_router


app = FastAPI(
    title="FinCore Python Service",
    description="OCR, Face Recognition and Liveness Detection Service",
    version="1.0.0"
)


# Register OCR routes
app.include_router(ocr_router)


# Register Face Recognition routes
app.include_router(face_router)


# Register Liveness routes
app.include_router(liveness_router)


@app.get("/")
def health_check():

    return {
        "status": "UP",
        "message": "FinCore Python Service is running",
        "services": [
            "OCR",
            "Face Recognition",
            "Liveness Detection"
        ]
    }