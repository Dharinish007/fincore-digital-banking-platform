package com.fincore.BankingManagement.Milestone4.kyc.dto;

public class KycVerificationRequest {


    private boolean ocrPassed;

    private boolean livenessPassed;

    private boolean faceMatchPassed;

    private String auditRef;


    public KycVerificationRequest() {
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


    public String getAuditRef() {
        return auditRef;
    }

    public void setAuditRef(String auditRef) {
        this.auditRef = auditRef;
    }
}