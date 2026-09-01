package com.digitalBanking.documentOCR.dto;

import com.digitalBanking.documentOCR.enums.DocumentType;
import com.digitalBanking.documentOCR.enums.VerificationStatus;

public class DocumentOcrRequest {

    private DocumentType documentType;

    private String fullName;

    private String dob;

    private String gender;

    private String documentNumber;

    private String address;

    private String issueDate;

    private String expiryDate;

    private Double confidenceScore;

    private String extractedRawText;

    private VerificationStatus verificationStatus;

    public DocumentOcrRequest() {
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getExtractedRawText() {
        return extractedRawText;
    }

    public void setExtractedRawText(String extractedRawText) {
        this.extractedRawText = extractedRawText;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }
}