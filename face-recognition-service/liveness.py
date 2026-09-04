from fastapi import APIRouter, UploadFile, File
from deepface import DeepFace

import cv2
import numpy as np
import traceback
import uuid

from datetime import datetime
from typing import Any, Dict, cast


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/liveness",
    tags=["Liveness Detection"]
)


# ============================================================
# LIVENESS VERIFY API
# ============================================================

@router.post("/verify")
async def verify_liveness(
    uploaded_file: UploadFile = File(...)
):

    request_id = str(uuid.uuid4())

    try:

        # ====================================================
        # 1. READ UPLOADED FILE
        # ====================================================

        print("\n======================================")
        print("LIVENESS VERIFICATION STARTED")
        print("======================================")

        print(
            "Uploaded file:",
            uploaded_file.filename
        )

        print(
            "Content type:",
            uploaded_file.content_type
        )

        image_bytes = await uploaded_file.read()

        print(
            "Image bytes:",
            len(image_bytes)
        )


        # ====================================================
        # 2. CHECK FILE
        # ====================================================

        if not image_bytes:

            return {
                "success": False,

                "requestId": request_id,

                "timestamp": datetime.now().isoformat(),

                "data": {
                    "passed": False,
                    "confidenceScore": 0.0,
                    "livenessScore": 0.0,
                    "capturedFrame": None,
                    "verificationStatus": "INVALID_REQUEST"
                },

                "error": {
                    "code": "LIVENESS_INVALID_REQUEST",

                    "message": "Uploaded image is empty.",

                    "details": None
                }
            }


        # ====================================================
        # 3. BYTES → NUMPY ARRAY
        # ====================================================

        np_array = np.frombuffer(
            image_bytes,
            dtype=np.uint8
        )


        # ====================================================
        # 4. NUMPY ARRAY → OPENCV IMAGE
        # ====================================================

        cv_image = cv2.imdecode(
            np_array,
            cv2.IMREAD_COLOR
        )


        # ====================================================
        # 5. CHECK IMAGE
        # ====================================================

        if cv_image is None:

            return {
                "success": False,

                "requestId": request_id,

                "timestamp": datetime.now().isoformat(),

                "data": {
                    "passed": False,
                    "confidenceScore": 0.0,
                    "livenessScore": 0.0,
                    "capturedFrame": None,
                    "verificationStatus": "INVALID_IMAGE"
                },

                "error": {
                    "code": "LIVENESS_INVALID_IMAGE",

                    "message": (
                        "Unable to decode the uploaded "
                        "image."
                    ),

                    "details": None
                }
            }


        # ====================================================
        # 6. GET IMAGE SIZE
        # ====================================================

        height, width = cv_image.shape[:2]

        print(
            f"Image size: {width} x {height}"
        )


        # ====================================================
        # 7. MINIMUM IMAGE SIZE CHECK
        # ====================================================

        if width < 200 or height < 200:

            return {
                "success": False,

                "requestId": request_id,

                "timestamp": datetime.now().isoformat(),

                "data": {
                    "passed": False,
                    "confidenceScore": 0.0,
                    "livenessScore": 0.0,
                    "capturedFrame": None,
                    "verificationStatus": "IMAGE_TOO_SMALL"
                },

                "error": {
                    "code": "LIVENESS_IMAGE_TOO_SMALL",

                    "message": (
                        "Image resolution is too small. "
                        "Please upload a larger image."
                    ),

                    "details": (
                        f"Received image size: "
                        f"{width}x{height}"
                    )
                }
            }


        # ====================================================
        # 8. DEEPFACE FACE DETECTION + ANTI-SPOOFING
        # ====================================================

        print(
            "\nStarting DeepFace..."
        )

        print(
            "Running face detection..."
        )

        print(
            "Running anti-spoofing..."
        )


        face_results = DeepFace.extract_faces(

            # IMPORTANT:
            # Pass cv_image, NOT uploaded_file
            img_path=cv_image,

            detector_backend="opencv",

            enforce_detection=True,

            align=True,

            anti_spoofing=True
        )


        print(
            f"Faces detected: {len(face_results)}"
        )


        # ====================================================
        # 9. NO FACE
        # ====================================================

        if len(face_results) == 0:

            print(
                "No face detected."
            )

            return {
                "success": False,

                "requestId": request_id,

                "timestamp": datetime.now().isoformat(),

                "data": {
                    "passed": False,
                    "confidenceScore": 0.0,
                    "livenessScore": 0.0,
                    "capturedFrame": None,
                    "verificationStatus": "NO_FACE"
                },

                "error": {
                    "code": "LIVENESS_NO_FACE",

                    "message": (
                        "No face detected. "
                        "Please look directly at the camera."
                    ),

                    "details": None
                }
            }


        # ====================================================
        # 10. MULTIPLE FACES
        # ====================================================

        if len(face_results) > 1:

            print(
                "Multiple faces detected."
            )

            return {
                "success": False,

                "requestId": request_id,

                "timestamp": datetime.now().isoformat(),

                "data": {
                    "passed": False,
                    "confidenceScore": 0.0,
                    "livenessScore": 0.0,
                    "capturedFrame": None,
                    "verificationStatus": "MULTIPLE_FACES"
                },

                "error": {
                    "code": "LIVENESS_MULTIPLE_FACES",

                    "message": (
                        "Multiple faces detected. "
                        "Only one person should be visible."
                    ),

                    "details": None
                }
            }


        # ====================================================
        # 11. GET FIRST FACE RESULT
        # ====================================================

        face: Dict[str, Any] = cast(
            Dict[str, Any],
            face_results[0]
        )


        # ====================================================
        # 12. GET ANTI-SPOOFING VALUES
        # ====================================================

        is_real = bool(
            face.get(
                "is_real",
                False
            )
        )


        antispoof_score = float(
            face.get(
                "antispoof_score",
                0.0
            )
        )


        face_confidence = float(
            face.get(
                "confidence",
                0.0
            )
        )


        # ====================================================
        # 13. PRINT RESULTS
        # ====================================================

        print("\n--------------------------------------")
        print("DEEPFACE RESULT")
        print("--------------------------------------")

        print(
            "Is Real:",
            is_real
        )

        print(
            "Anti-Spoof Score:",
            antispoof_score
        )

        print(
            "Face Confidence:",
            face_confidence
        )

        print("--------------------------------------")


        # ====================================================
        # 14. SPOOF DETECTED
        # ====================================================

        if not is_real:

            print(
                "RESULT: SPOOF DETECTED"
            )

            print(
                "======================================\n"
            )

            return {
                "success": False,

                "requestId": request_id,

                "timestamp": datetime.now().isoformat(),

                "data": {
                    "passed": False,

                    "confidenceScore": face_confidence,

                    "livenessScore": antispoof_score,

                    "capturedFrame": None,

                    "verificationStatus": "SPOOF_DETECTED"
                },

                "error": {
                    "code": "LIVENESS_SPOOF_DETECTED",

                    "message": (
                        "The submitted image appears "
                        "to be a spoof or presentation attack."
                    ),

                    "details": {
                        "antiSpoofScore": antispoof_score
                    }
                }
            }


        # ====================================================
        # 15. LIVENESS PASSED
        # ====================================================

        print(
            "RESULT: REAL FACE"
        )

        print(
            "LIVENESS VERIFICATION PASSED"
        )

        print(
            "======================================\n"
        )


        return {
            "success": True,

            "requestId": request_id,

            "timestamp": datetime.now().isoformat(),

            "data": {
                "passed": True,

                "confidenceScore": face_confidence,

                "livenessScore": antispoof_score,

                "capturedFrame": None,

                "verificationStatus": "VERIFIED"
            },

            "error": None
        }


    # ========================================================
    # 16. ERROR HANDLING
    # ========================================================

    except Exception as e:

        print(
            "\n======================================"
        )

        print(
            "LIVENESS INTERNAL ERROR"
        )

        print(
            "======================================"
        )

        traceback.print_exc()

        print(
            "======================================\n"
        )


        return {
            "success": False,

            "requestId": request_id,

            "timestamp": datetime.now().isoformat(),

            "data": {
                "passed": False,

                "confidenceScore": 0.0,

                "livenessScore": 0.0,

                "capturedFrame": None,

                "verificationStatus": "ERROR"
            },

            "error": {
                "code": "LIVENESS_INTERNAL_ERROR",

                "message": (
                    "An internal error occurred "
                    "while processing liveness."
                ),

                "details": str(e)
            }
        }