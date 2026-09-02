package com.fincore.face_match_service.service;

import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.objdetect.FaceDetectorYN;
import org.opencv.objdetect.FaceRecognizerSF;
import nu.pattern.OpenCV;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class OnnxFaceEmbeddingService
        implements FaceEmbeddingService {

    private static final String DETECTION_MODEL =
            "src/main/resources/models/face_detection_yunet_2023mar.onnx";

    private static final String RECOGNITION_MODEL =
            "src/main/resources/models/face_recognition_sface_2021dec.onnx";

    private final FaceDetectorYN faceDetector;
    private final FaceRecognizerSF faceRecognizer;

    public OnnxFaceEmbeddingService() {

        // Load OpenCV native library
        OpenCV.loadLocally();

        // YuNet face detector
        faceDetector = FaceDetectorYN.create(
                DETECTION_MODEL,
                "",
                new Size(320, 320),
                0.9f,
                0.3f,
                5000
        );

        // SFace face recognition model
        faceRecognizer = FaceRecognizerSF.create(
                RECOGNITION_MODEL,
                ""
        );
    }

    @Override
    public float[] extractEmbedding(
            MultipartFile image) {

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException(
                    "Image is required"
            );
        }

        try {

            // 1. Convert uploaded image to byte array
            byte[] imageBytes = image.getBytes();

            // 2. Decode image bytes into OpenCV Mat
            Mat imageMat = Imgcodecs.imdecode(
                    new MatOfByte(imageBytes),
                    Imgcodecs.IMREAD_COLOR
            );

            if (imageMat.empty()) {
                throw new IllegalArgumentException(
                        "Unable to decode image"
                );
            }

            // 3. Set detector input size
            faceDetector.setInputSize(
                    new Size(
                            imageMat.cols(),
                            imageMat.rows()
                    )
            );

            // 4. Detect faces
            Mat faces = new Mat();

            int detectedFaces =
                    faceDetector.detect(
                            imageMat,
                            faces
                    );

            if (detectedFaces <= 0 || faces.empty()) {
                imageMat.release();
                faces.release();

                throw new IllegalArgumentException(
                        "No face detected in image"
                );
            }

            // 5. Select the first detected face
            Mat face = faces.row(0);

            // 6. Align and crop face for SFace
            Mat alignedFace = new Mat();

            faceRecognizer.alignCrop(
                    imageMat,
                    face,
                    alignedFace
            );

            // 7. Generate SFace embedding
            Mat embedding = new Mat();

            faceRecognizer.feature(
                    alignedFace,
                    embedding
            );

            // 8. Convert OpenCV Mat → float[]
            float[] result =
                    new float[(int) embedding.total()];

            embedding.get(
                    0,
                    0,
                    result
            );

            // Release native memory
            imageMat.release();
            faces.release();
            face.release();
            alignedFace.release();
            embedding.release();

            return result;

        } catch (IOException e) {

            throw new IllegalArgumentException(
                    "Unable to read uploaded image",
                    e
            );
        }
    }
}