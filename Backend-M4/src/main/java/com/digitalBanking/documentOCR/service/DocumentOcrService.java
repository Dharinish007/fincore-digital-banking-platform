package com.digitalBanking.documentOCR.service;

import com.digitalBanking.documentOCR.client.OcrApiClient;
import com.digitalBanking.documentOCR.client.OcrApiResponse;
import com.digitalBanking.documentOCR.dto.DocumentOcrResponse;
import com.digitalBanking.documentOCR.entity.DocumentOcr;
import com.digitalBanking.documentOCR.enums.DocumentType;
import com.digitalBanking.documentOCR.enums.VerificationStatus;
import com.digitalBanking.documentOCR.parser.DocumentFieldParser;
import com.digitalBanking.documentOCR.repository.DocumentOcrRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DocumentOcrService {

    private final DocumentOcrRepository documentOcrRepository;
    private final OcrApiClient ocrApiClient;
    private final DocumentFieldParser documentFieldParser;

    @Value("${document.upload-dir}")
    private String uploadDir;

    public DocumentOcrService(
            DocumentOcrRepository documentOcrRepository,
            OcrApiClient ocrApiClient,
            DocumentFieldParser documentFieldParser) {

        this.documentOcrRepository = documentOcrRepository;
        this.ocrApiClient = ocrApiClient;
        this.documentFieldParser = documentFieldParser;
    }

    public DocumentOcrResponse processDocument(
            MultipartFile document,
            DocumentType documentType) {

        // 1. Validate document
        if (document == null || document.isEmpty()) {
            throw new IllegalArgumentException(
                    "Document file is required"
            );
        }

        // 2. Validate document type
        if (documentType == null) {
            throw new IllegalArgumentException(
                    "Document type is required"
            );
        }

        // 3. Validate file type
        String contentType = document.getContentType();

        if (contentType == null) {
            throw new IllegalArgumentException(
                    "Unable to determine document file type"
            );
        }

        if (!contentType.startsWith("image/") &&
                !contentType.equals("application/octet-stream")) {

            throw new IllegalArgumentException(
                    "Only image files are supported currently"
            );
        }

        // 4. Save uploaded document
        String filePath = saveUploadedDocument(document);

        // 5. Send document to Python OCR service
        OcrApiResponse ocrResult =
                ocrApiClient.extractText(document);

        // 6. Get extracted raw text
        String extractedRawText =
                ocrResult != null &&
                ocrResult.getExtractedRawText() != null
                        ? ocrResult.getExtractedRawText()
                        : "";

        // 7. Get OCR confidence score
        Double confidenceScore =
                ocrResult != null &&
                ocrResult.getConfidenceScore() != null
                        ? ocrResult.getConfidenceScore()
                        : 0.0;

        // 8. Create Document OCR entity
        DocumentOcr documentOcr = new DocumentOcr();

        documentOcr.setDocumentType(documentType);

        documentOcr.setExtractedRawText(
                extractedRawText
        );

        documentOcr.setConfidenceScore(
                confidenceScore
        );

        // 9. Extract individual fields from OCR text
        documentFieldParser.parseFields(
                extractedRawText,
                documentOcr
        );

        // 10. Determine verification status
        VerificationStatus verificationStatus;

        if (confidenceScore >= 70.0 &&
                !extractedRawText.isBlank()) {

            verificationStatus =
                    VerificationStatus.VERIFIED;

        } else {

            verificationStatus =
                    VerificationStatus.NEEDS_REVIEW;
        }

        documentOcr.setVerificationStatus(
                verificationStatus
        );

        // 11. Store uploaded file path
        documentOcr.setUploadedFilePath(
                filePath
        );

        // 12. Generate request ID
        String requestId =
                "REQ-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        documentOcr.setRequestId(
                requestId
        );

        // 13. Set creation timestamp
        documentOcr.setCreatedAt(
                LocalDateTime.now()
        );

        // 14. Save OCR result to database
        DocumentOcr savedDocument =
                documentOcrRepository.save(documentOcr);

        // 15. Return response
        return createResponse(
                savedDocument,
                "Document OCR processed successfully"
        );
    }

    /**
     * Saves the uploaded document to the configured
     * document upload directory.
     */
    private String saveUploadedDocument(
            MultipartFile document) {

        try {

            Path uploadPath =
                    Paths.get(uploadDir);

            Files.createDirectories(
                    uploadPath
            );

            String originalFilename =
                    document.getOriginalFilename();

            String extension = "";

            if (originalFilename != null &&
                    originalFilename.contains(".")) {

                extension =
                        originalFilename.substring(
                                originalFilename.lastIndexOf(".")
                        );
            }

            String filename =
                    UUID.randomUUID() + extension;

            Path destination =
                    uploadPath.resolve(filename);

            Files.copy(
                    document.getInputStream(),
                    destination
            );

            return destination.toString();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save uploaded document",
                    e
            );
        }
    }

    /**
     * Retrieves a previously processed OCR record
     * using its database ID.
     */
    public DocumentOcrResponse getDocumentById(
            Long id) {

        DocumentOcr document =
                documentOcrRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document OCR record not found with id: "
                                                + id
                                )
                        );

        return createResponse(
                document,
                "Document OCR record retrieved successfully"
        );
    }

    /**
     * Converts the database entity into the API response.
     */
    private DocumentOcrResponse createResponse(
            DocumentOcr document,
            String message) {

        DocumentOcrResponse response =
                new DocumentOcrResponse();

        response.setSuccess(true);

        response.setId(
                document.getId()
        );

        response.setRequestId(
                document.getRequestId()
        );

        response.setTimestamp(
                document.getCreatedAt()
        );

        response.setDocumentType(
                document.getDocumentType()
        );

        response.setFullName(
                document.getFullName()
        );

        response.setDob(
                document.getDob()
        );

        response.setGender(
                document.getGender()
        );

        response.setDocumentNumber(
                document.getDocumentNumber()
        );

        response.setAddress(
                document.getAddress()
        );

        response.setIssueDate(
                document.getIssueDate()
        );

        response.setExpiryDate(
                document.getExpiryDate()
        );

        response.setConfidenceScore(
                document.getConfidenceScore()
        );

        response.setExtractedRawText(
                document.getExtractedRawText()
        );

        response.setVerificationStatus(
                document.getVerificationStatus()
        );

        response.setMessage(
                message
        );

        return response;
    }
}