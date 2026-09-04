package com.digitalBanking.FaceMatching.dto;

public class FaceMatchResponse {

    private boolean matched;

    private Double distance;

    private Double threshold;

    private String model;

    private String message;


    // Default constructor
    public FaceMatchResponse() {
    }


    // Constructor for errors
    public FaceMatchResponse(String message) {
        this.message = message;
    }


    public boolean isMatched() {
        return matched;
    }

    public void setMatched(boolean matched) {
        this.matched = matched;
    }


    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }


    public Double getThreshold() {
        return threshold;
    }

    public void setThreshold(Double threshold) {
        this.threshold = threshold;
    }


    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}