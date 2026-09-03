package com.fincore.kyc.dto;

public class KycResponse {

    private Long id;
    private Long customerId;
    private String applicationNumber;
    private String fullName;
    private String status;
    private String riskLevel;
    private Double faceMatchScore;
    private Boolean ocrVerified;
    private Boolean livenessVerified;

    public KycResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getFaceMatchScore() {
        return faceMatchScore;
    }

    public void setFaceMatchScore(Double faceMatchScore) {
        this.faceMatchScore = faceMatchScore;
    }

    public Boolean getOcrVerified() {
        return ocrVerified;
    }

    public void setOcrVerified(Boolean ocrVerified) {
        this.ocrVerified = ocrVerified;
    }

    public Boolean getLivenessVerified() {
        return livenessVerified;
    }

    public void setLivenessVerified(Boolean livenessVerified) {
        this.livenessVerified = livenessVerified;
    }
}