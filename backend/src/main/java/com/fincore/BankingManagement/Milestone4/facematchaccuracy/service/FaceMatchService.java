package com.fincore.BankingManagement.Milestone4.facematchaccuracy.service;

import com.fincore.BankingManagement.Milestone4.facematchaccuracy.dto.FaceMatchResponse;
import com.fincore.BankingManagement.Milestone4.facematchaccuracy.model.FaceMatchVerification;
import com.fincore.BankingManagement.Milestone4.facematchaccuracy.repository.FaceMatchVerificationRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FaceMatchService {

    private final RestTemplate restTemplate;

    private final FaceMatchVerificationRepository
            faceMatchVerificationRepository;


    public FaceMatchResponse verifyFace(
            MultipartFile registeredImage,
            MultipartFile selfieImage
    ) {

        try {

            String fastApiUrl =
                    "http://127.0.0.1:8000/face-match";


            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.MULTIPART_FORM_DATA
            );


            MultiValueMap<String, Object> body =
                    new LinkedMultiValueMap<>();


            // =================================================
            // REGISTERED IMAGE
            // =================================================

            body.add(
                    "registered_image",

                    new ByteArrayResource(
                            registeredImage.getBytes()
                    ) {

                        @Override
                        public String getFilename() {

                            return registeredImage
                                    .getOriginalFilename();
                        }
                    }
            );


            // =================================================
            // SELFIE IMAGE
            // =================================================

            body.add(
                    "selfie_image",

                    new ByteArrayResource(
                            selfieImage.getBytes()
                    ) {

                        @Override
                        public String getFilename() {

                            return selfieImage
                                    .getOriginalFilename();
                        }
                    }
            );


            HttpEntity<MultiValueMap<String, Object>>
                    request =
                    new HttpEntity<>(
                            body,
                            headers
                    );


            // =================================================
            // CALL FASTAPI
            // =================================================

            ResponseEntity<FaceMatchResponse>
                    response =

                    restTemplate.postForEntity(
                            fastApiUrl,
                            request,
                            FaceMatchResponse.class
                    );


            FaceMatchResponse result =
                    response.getBody();


            // =================================================
            // SAVE RESULT TO DATABASE
            // =================================================

            if (result != null) {

                FaceMatchVerification verification =
                        new FaceMatchVerification();


                verification.setMatched(
                        result.isMatched()
                );

                verification.setDistance(
                        result.getDistance()
                );

                verification.setThreshold(
                        result.getThreshold()
                );

                verification.setModel(
                        result.getModel()
                );

                verification.setMessage(
                        result.getMessage()
                );


                faceMatchVerificationRepository.save(
                        verification
                );
            }


            return result;


        } catch (Exception e) {

            FaceMatchResponse errorResponse =
                    new FaceMatchResponse(
                            "Face verification failed: "
                                    + e.getMessage()
                    );


            // Save failed verification
            FaceMatchVerification verification =
                    new FaceMatchVerification();

            verification.setMatched(false);

            verification.setMessage(
                    errorResponse.getMessage()
            );

            faceMatchVerificationRepository.save(
                    verification
            );


            return errorResponse;
        }
    }
}