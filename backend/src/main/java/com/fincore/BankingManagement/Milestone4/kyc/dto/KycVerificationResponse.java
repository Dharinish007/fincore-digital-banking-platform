package com.fincore.BankingManagement.Milestone4.kyc.dto;

import com.fincore.BankingManagement.Milestone4.kyc.model.KycStatus;

import java.time.LocalDateTime;

public class KycVerificationResponse {

    private boolean success;

    private String message;

    private Long kycId;

    private Long customerId;

    private KycStatus kycStatus;

    private String auditRef;

    private LocalDateTime verifiedAt;


    public KycVerificationResponse() {
    }


    public KycVerificationResponse(
            boolean success,
            String message,
            Long kycId,
            Long customerId,
            KycStatus kycStatus,
            String auditRef,
            LocalDateTime verifiedAt
    ) {

        this.success = success;
        this.message = message;
        this.kycId = kycId;
        this.customerId = customerId;
        this.kycStatus = kycStatus;
        this.auditRef = auditRef;
        this.verifiedAt = verifiedAt;
    }


    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public Long getKycId() {
        return kycId;
    }

    public void setKycId(Long kycId) {
        this.kycId = kycId;
    }


    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }


    public KycStatus getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(KycStatus kycStatus) {
        this.kycStatus = kycStatus;
    }


    public String getAuditRef() {
        return auditRef;
    }

    public void setAuditRef(String auditRef) {
        this.auditRef = auditRef;
    }


    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}