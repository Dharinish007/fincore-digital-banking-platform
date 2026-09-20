package com.fincore.face_match_service.service;

import com.fincore.face_match_service.dto.FaceMatchRequest;
import com.fincore.face_match_service.dto.FaceMatchResponse;

public interface FaceMatchService {

    FaceMatchResponse performFaceMatch(
            FaceMatchRequest request
    );

    FaceMatchResponse getVerification(
            String verificationId
    );
}