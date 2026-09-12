package com.fincore.face_match_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RealFaceMatchEngine implements FaceMatchEngine {

    private final FaceEmbeddingService faceEmbeddingService;

    public RealFaceMatchEngine(
            FaceEmbeddingService faceEmbeddingService) {

        this.faceEmbeddingService = faceEmbeddingService;
    }

    @Override
    public double compareFaces(
            MultipartFile documentImage,
            MultipartFile selfieImage) {

        if (documentImage == null || documentImage.isEmpty()) {
            throw new IllegalArgumentException(
                    "Document image is required"
            );
        }

        if (selfieImage == null || selfieImage.isEmpty()) {
            throw new IllegalArgumentException(
                    "Selfie image is required"
            );
        }

        // Extract face embedding from document image
        float[] documentEmbedding =
                faceEmbeddingService.extractEmbedding(
                        documentImage
                );

        // Extract face embedding from selfie
        float[] selfieEmbedding =
                faceEmbeddingService.extractEmbedding(
                        selfieImage
                );

        // Calculate cosine similarity
        return cosineSimilarity(
                documentEmbedding,
                selfieEmbedding
        );
    }

    private double cosineSimilarity(
            float[] embedding1,
            float[] embedding2) {

        if (embedding1 == null || embedding2 == null) {
            throw new IllegalArgumentException(
                    "Face embeddings cannot be null"
            );
        }

        if (embedding1.length != embedding2.length) {
            throw new IllegalArgumentException(
                    "Face embeddings must have the same size"
            );
        }

        double dotProduct = 0.0;
        double magnitude1 = 0.0;
        double magnitude2 = 0.0;

        for (int i = 0; i < embedding1.length; i++) {

            dotProduct +=
                    embedding1[i] * embedding2[i];

            magnitude1 +=
                    embedding1[i] * embedding1[i];

            magnitude2 +=
                    embedding2[i] * embedding2[i];
        }

        if (magnitude1 == 0 || magnitude2 == 0) {
            throw new IllegalArgumentException(
                    "Invalid face embedding"
            );
        }

        return dotProduct /
                (Math.sqrt(magnitude1) *
                 Math.sqrt(magnitude2));
    }
}