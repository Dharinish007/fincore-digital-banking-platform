package com.digitalBanking.liveness.dto;

import org.springframework.web.multipart.MultipartFile;

public class LivenessRequest {

    private MultipartFile image;

    public LivenessRequest() {
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }
}