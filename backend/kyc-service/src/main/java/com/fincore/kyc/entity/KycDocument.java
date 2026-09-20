package com.fincore.kyc.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "kyc_documents")
public class KycDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long kycApplicationId;

    private String documentType;

    private String documentNumber;

    private Boolean ocrVerified;

    private String documentStatus;

    public KycDocument() {
    }

    public Long getId() {
        return id;
    }

    public Long getKycApplicationId() {
        return kycApplicationId;
    }

    public void setKycApplicationId(Long kycApplicationId) {
        this.kycApplicationId = kycApplicationId;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public Boolean getOcrVerified() {
        return ocrVerified;
    }

    public void setOcrVerified(Boolean ocrVerified) {
        this.ocrVerified = ocrVerified;
    }

    public String getDocumentStatus() {
        return documentStatus;
    }

    public void setDocumentStatus(String documentStatus) {
        this.documentStatus = documentStatus;
    }
}