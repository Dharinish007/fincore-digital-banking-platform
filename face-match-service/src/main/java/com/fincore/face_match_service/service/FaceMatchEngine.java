package com.fincore.face_match_service.service;

import org.springframework.web.multipart.MultipartFile;

public interface FaceMatchEngine {

    double compareFaces(
            MultipartFile documentImage,
            MultipartFile selfieImage
    );
}