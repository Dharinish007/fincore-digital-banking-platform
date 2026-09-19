package com.fincore.BankingManagement.Milestone4.kyc.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_verification")
public class KycVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kyc_id")
    private Long kycId;


    @Column(name = "customer_id", nullable = true)
    private Long customerId;


    @Column(name = "ocr_passed", nullable = false)
    private boolean ocrPassed;


    @Column(name = "liveness_passed", nullable = false)
    private boolean livenessPassed;


    @Column(name = "face_match_passed", nullable = false)
    private boolean faceMatchPassed;


    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    private KycStatus kycStatus;


    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;


    @Column(name = "audit_ref")
    private String auditRef;


    @PrePersist
    public void prePersist() {

        if (kycStatus == null) {
            kycStatus = KycStatus.PENDING;
        }

        if (auditRef == null || auditRef.isBlank()) {
            auditRef =
                    "KYC-" +
                            System.currentTimeMillis();
        }
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

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


    public boolean isOcrPassed() {
        return ocrPassed;
    }

    public void setOcrPassed(boolean ocrPassed) {
        this.ocrPassed = ocrPassed;
    }


    public boolean isLivenessPassed() {
        return livenessPassed;
    }

    public void setLivenessPassed(boolean livenessPassed) {
        this.livenessPassed = livenessPassed;
    }


    public boolean isFaceMatchPassed() {
        return faceMatchPassed;
    }

    public void setFaceMatchPassed(boolean faceMatchPassed) {
        this.faceMatchPassed = faceMatchPassed;
    }


    public KycStatus getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(KycStatus kycStatus) {
        this.kycStatus = kycStatus;
    }


    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }


    public String getAuditRef() {
        return auditRef;
    }

    public void setAuditRef(String auditRef) {
        this.auditRef = auditRef;
    }
}