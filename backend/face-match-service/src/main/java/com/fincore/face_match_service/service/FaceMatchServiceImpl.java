package com.fincore.face_match_service.service;

import com.fincore.face_match_service.dto.FaceMatchRequest;
import com.fincore.face_match_service.dto.FaceMatchResponse;
import com.fincore.face_match_service.entity.FaceMatch;
import com.fincore.face_match_service.enums.FaceMatchStatus;
import com.fincore.face_match_service.repository.FaceMatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FaceMatchServiceImpl implements FaceMatchService {

    /*
     * SFace cosine similarity threshold.
     *
     * The similarity score is approximately between -1 and 1.
     * 0.363 is used as the initial threshold.
     */
    private static final double MATCH_THRESHOLD = 0.363;

    private final FaceMatchRepository faceMatchRepository;
    private final FaceMatchEngine faceMatchEngine;

    public FaceMatchServiceImpl(
            FaceMatchRepository faceMatchRepository,
            FaceMatchEngine faceMatchEngine) {

        this.faceMatchRepository = faceMatchRepository;
        this.faceMatchEngine = faceMatchEngine;
    }

    @Override
    public FaceMatchResponse performFaceMatch(
            FaceMatchRequest request) {

        // Validate request
        validateRequest(request);

        // Create face match record
        FaceMatch faceMatch = new FaceMatch();

        faceMatch.setVerificationId(
                generateVerificationId()
        );

        faceMatch.setCustomerId(
                request.getCustomerId()
        );

        faceMatch.setDocumentId(
                request.getDocumentId()
        );

        faceMatch.setThreshold(
                MATCH_THRESHOLD
        );

        faceMatch.setStatus(
                FaceMatchStatus.PENDING
        );

        faceMatch.setCreatedAt(
                LocalDateTime.now()
        );

        faceMatch.setUpdatedAt(
                LocalDateTime.now()
        );

        /*
         * Compare the face from the document image
         * with the face from the selfie.
         *
         * The FaceMatchEngine internally:
         *
         * Document image
         *       ↓
         * YuNet face detection
         *       ↓
         * SFace embedding
         *
         * Selfie image
         *       ↓
         * YuNet face detection
         *       ↓
         * SFace embedding
         *
         *       ↓
         *
         * Cosine similarity
         */
        double matchScore = faceMatchEngine.compareFaces(
                request.getDocumentImage(),
                request.getSelfieImage()
        );

        faceMatch.setMatchScore(matchScore);

        // Determine match result
        if (matchScore >= MATCH_THRESHOLD) {

            faceMatch.setMatched(true);

            faceMatch.setStatus(
                    FaceMatchStatus.MATCHED
            );

            faceMatch.setMessage(
                    "Face matched successfully"
            );

        } else {

            faceMatch.setMatched(false);

            faceMatch.setStatus(
                    FaceMatchStatus.NOT_MATCHED
            );

            faceMatch.setMessage(
                    "Face did not meet the matching threshold"
            );
        }

        faceMatch.setUpdatedAt(
                LocalDateTime.now()
        );

        // Save result
        FaceMatch savedFaceMatch =
                faceMatchRepository.save(faceMatch);

        // Convert entity to response
        return convertToResponse(savedFaceMatch);
    }

    @Override
    public FaceMatchResponse getVerification(
            String verificationId) {

        FaceMatch faceMatch =
                faceMatchRepository
                        .findByVerificationId(verificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Face verification not found: "
                                                + verificationId
                                )
                        );

        return convertToResponse(faceMatch);
    }

    /**
     * Validates the complete face match request.
     */
    private void validateRequest(
            FaceMatchRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Face match request is required"
            );
        }

        // Validate customer ID
        if (request.getCustomerId() == null ||
                request.getCustomerId() <= 0) {

            throw new IllegalArgumentException(
                    "Customer ID must be positive"
            );
        }

        // Validate document ID
        if (request.getDocumentId() == null ||
                request.getDocumentId() <= 0) {

            throw new IllegalArgumentException(
                    "Document ID must be positive"
            );
        }

        // Validate document image
        validateImage(
                request.getDocumentImage(),
                "Document image"
        );

        // Validate selfie image
        validateImage(
                request.getSelfieImage(),
                "Selfie image"
        );
    }

    /**
     * Validates uploaded image.
     *
     * Accepts JPG, JPEG and PNG files.
     */
    private void validateImage(
            MultipartFile file,
            String imageName) {

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    imageName + " is required"
            );
        }

        String contentType =
                file.getContentType();

        String fileName =
                file.getOriginalFilename();

        /*
         * Check MIME type.
         *
         * Example:
         * image/jpeg
         * image/png
         */
        boolean validContentType =
                contentType != null &&
                contentType
                        .toLowerCase()
                        .startsWith("image/");

        /*
         * Check file extension as a fallback.
         *
         * This helps when Postman/browser does not
         * provide the expected MIME type.
         */
        boolean validExtension =
                fileName != null &&
                (
                        fileName
                                .toLowerCase()
                                .endsWith(".jpg")

                        || fileName
                                .toLowerCase()
                                .endsWith(".jpeg")

                        || fileName
                                .toLowerCase()
                                .endsWith(".png")
                );

        if (!validContentType && !validExtension) {

            throw new IllegalArgumentException(
                    imageName +
                            " must be a JPG, JPEG, or PNG image"
            );
        }
    }

    /**
     * Generates a unique verification ID.
     *
     * Example:
     * FM-A12B34CD
     */
    private String generateVerificationId() {

        return "FM-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    /**
     * Converts FaceMatch entity into API response DTO.
     */
    private FaceMatchResponse convertToResponse(
            FaceMatch faceMatch) {

        FaceMatchResponse response =
                new FaceMatchResponse();

        response.setVerificationId(
                faceMatch.getVerificationId()
        );

        response.setCustomerId(
                faceMatch.getCustomerId()
        );

        response.setMatchScore(
                faceMatch.getMatchScore()
        );

        response.setThreshold(
                faceMatch.getThreshold()
        );

        response.setMatched(
                faceMatch.getMatched()
        );

        response.setStatus(
                faceMatch.getStatus().name()
        );

        response.setMessage(
                faceMatch.getMessage()
        );

        return response;
    }
}