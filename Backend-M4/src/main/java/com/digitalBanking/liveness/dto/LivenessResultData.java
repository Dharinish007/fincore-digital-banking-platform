package com.digitalBanking.liveness.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LivenessResultData {

    private boolean passed;

    private double confidenceScore;

    private double livenessScore;

    private String capturedFrame;

    private String verificationStatus;


    public LivenessResultData() {
    }


    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }


    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }


    public double getLivenessScore() {
        return livenessScore;
    }

    public void setLivenessScore(double livenessScore) {
        this.livenessScore = livenessScore;
    }


    public String getCapturedFrame() {
        return capturedFrame;
    }

    public void setCapturedFrame(String capturedFrame) {
        this.capturedFrame = capturedFrame;
    }


    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }
}