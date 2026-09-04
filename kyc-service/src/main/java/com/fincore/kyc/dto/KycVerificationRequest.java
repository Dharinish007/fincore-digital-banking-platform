package com.fincore.kyc.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class KycVerificationRequest {

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double faceMatchScore;

    public KycVerificationRequest() {
    }

    public Double getFaceMatchScore() {
        return faceMatchScore;
    }

    public void setFaceMatchScore(Double faceMatchScore) {
        this.faceMatchScore = faceMatchScore;
    }
}