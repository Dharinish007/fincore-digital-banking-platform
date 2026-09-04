from fastapi import FastAPI, UploadFile, File
from deepface import DeepFace
import os
import uuid
import cv2
import traceback

from liveness import router as liveness_router


app = FastAPI()

# Register liveness routes
app.include_router(liveness_router)


@app.get("/")
def home():
    return {"message": "Face Recognition Service is Running"}


@app.post("/face-match")
async def face_match(
    registered_image: UploadFile = File(...),
    selfie_image: UploadFile = File(...)
):

    base_dir = os.path.dirname(os.path.abspath(__file__))
    temp_dir = os.path.join(base_dir, "temp")
    os.makedirs(temp_dir, exist_ok=True)

    registered_path = os.path.join(
        temp_dir,
        f"{uuid.uuid4()}_registered.jpg"
    )

    selfie_path = os.path.join(
        temp_dir,
        f"{uuid.uuid4()}_selfie.jpg"
    )

    try:
        # Save images
        with open(registered_path, "wb") as f:
            f.write(await registered_image.read())

        with open(selfie_path, "wb") as f:
            f.write(await selfie_image.read())

        # Check images
        img1 = cv2.imread(registered_path)
        img2 = cv2.imread(selfie_path)

        print(
            "Image 1:",
            img1.shape if img1 is not None else "NOT READABLE"
        )

        print(
            "Image 2:",
            img2.shape if img2 is not None else "NOT READABLE"
        )

        if img1 is None or img2 is None:
            return {
                "matched": False,
                "message": "OpenCV cannot read image"
            }

        print("Starting DeepFace verification...")

        # IMPORTANT: Use file paths directly
        result = DeepFace.verify(
            img1_path=registered_path,
            img2_path=selfie_path,
            model_name="VGG-Face",
            detector_backend="opencv",
            enforce_detection=False
        )

        print("RESULT:", result)

        return {
            "matched": bool(result["verified"]),
            "distance": float(result["distance"]),
            "threshold": float(result["threshold"]),
            "model": result["model"]
        }

    except Exception as e:

        print("\n========== FULL ERROR ==========")
        traceback.print_exc()
        print("================================\n")

        return {
            "matched": False,
            "message": str(e)
        }

    finally:

        if os.path.exists(registered_path):
            os.remove(registered_path)

        if os.path.exists(selfie_path):
            os.remove(selfie_path)