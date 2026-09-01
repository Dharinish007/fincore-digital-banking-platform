package com.digitalBanking.documentOCR.service;

import com.digitalBanking.documentOCR.dto.DocumentOcrRequest;
import com.digitalBanking.documentOCR.dto.DocumentOcrResponse;
import com.digitalBanking.documentOCR.entity.DocumentOcr;
import com.digitalBanking.documentOCR.repository.DocumentOcrRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DocumentOcrService {

    private final DocumentOcrRepository documentOcrRepository;

    public DocumentOcrService(DocumentOcrRepository documentOcrRepository) {
        this.documentOcrRepository = documentOcrRepository;
    }

    // Process and save OCR data
    public DocumentOcrResponse processDocument(DocumentOcrRequest request) {

        // Validate request
        if (request == null) {
            throw new IllegalArgumentException("OCR request cannot be null");
        }

        if (request.getDocumentType() == null) {
            throw new IllegalArgumentException("Document type is required");
        }

        if (request.getDocumentNumber() == null ||
                request.getDocumentNumber().isBlank()) {
            throw new IllegalArgumentException("Document number is required");
        }

        if (request.getFullName() == null ||
                request.getFullName().isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }

        // Create entity
        DocumentOcr documentOcr = new DocumentOcr();

        documentOcr.setDocumentType(request.getDocumentType());
        documentOcr.setFullName(request.getFullName());
        documentOcr.setDob(request.getDob());
        documentOcr.setGender(request.getGender());
        documentOcr.setDocumentNumber(request.getDocumentNumber());
        documentOcr.setAddress(request.getAddress());
        documentOcr.setIssueDate(request.getIssueDate());
        documentOcr.setExpiryDate(request.getExpiryDate());
        documentOcr.setConfidenceScore(request.getConfidenceScore());
        documentOcr.setExtractedRawText(request.getExtractedRawText());
        documentOcr.setVerificationStatus(request.getVerificationStatus());

        // Generate unique request ID
        String requestId = "REQ-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        documentOcr.setRequestId(requestId);
        documentOcr.setCreatedAt(LocalDateTime.now());

        // Save to database
        DocumentOcr savedDocument =
                documentOcrRepository.save(documentOcr);

        // Convert saved entity to response
        return createResponse(
                savedDocument,
                "Document OCR data saved successfully"
        );
    }

    // Get OCR record by ID
    public DocumentOcrResponse getDocumentById(Long id) {

        DocumentOcr document = documentOcrRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Document OCR record not found with id: " + id
                        )
                );

        return createResponse(
                document,
                "Document OCR record retrieved successfully"
        );
    }

    // Convert Entity to Response DTO
    private DocumentOcrResponse createResponse(
            DocumentOcr document,
            String message) {

        DocumentOcrResponse response = new DocumentOcrResponse();

        response.setSuccess(true);
        response.setId(document.getId());
        response.setRequestId(document.getRequestId());
        response.setTimestamp(document.getCreatedAt());

        response.setDocumentType(document.getDocumentType());
        response.setFullName(document.getFullName());
        response.setDob(document.getDob());
        response.setGender(document.getGender());
        response.setDocumentNumber(document.getDocumentNumber());
        response.setAddress(document.getAddress());
        response.setIssueDate(document.getIssueDate());
        response.setExpiryDate(document.getExpiryDate());
        response.setConfidenceScore(document.getConfidenceScore());
        response.setExtractedRawText(document.getExtractedRawText());
        response.setVerificationStatus(
                document.getVerificationStatus()
        );

        response.setMessage(message);

        return response;
    }
}