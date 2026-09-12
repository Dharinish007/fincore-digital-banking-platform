package com.fincore.face_match_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.web.multipart.MultipartFile;

public class FaceMatchRequest {

    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be positive")
    private Long customerId;

    @NotNull(message = "Document ID is required")
    @Positive(message = "Document ID must be positive")
    private Long documentId;

    @NotNull(message = "Document image is required")
    private MultipartFile documentImage;

    @NotNull(message = "Selfie image is required")
    private MultipartFile selfieImage;


    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public MultipartFile getDocumentImage() {
        return documentImage;
    }

    public void setDocumentImage(MultipartFile documentImage) {
        this.documentImage = documentImage;
    }

    public MultipartFile getSelfieImage() {
        return selfieImage;
    }

    public void setSelfieImage(MultipartFile selfieImage) {
        this.selfieImage = selfieImage;
    }
}