package com.digitalBanking.documentOCR.client;

public class OcrApiResponse {

    private String extractedRawText;
    private Double confidenceScore;

    public OcrApiResponse() {
    }

    public String getExtractedRawText() {
        return extractedRawText;
    }

    public void setExtractedRawText(String extractedRawText) {
        this.extractedRawText = extractedRawText;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}