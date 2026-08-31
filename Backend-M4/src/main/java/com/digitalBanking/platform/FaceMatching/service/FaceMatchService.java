package com.digitalBanking.platform.FaceMatching.service;

import com.digitalBanking.platform.FaceMatching.dto.FaceMatchResponse;
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

    public FaceMatchResponse verifyFace(
            MultipartFile registeredImage,
            MultipartFile selfieImage
    ) {

        try {

            String fastApiUrl =
                    "http://127.0.0.1:8001/face-match";

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(
                    MediaType.MULTIPART_FORM_DATA
            );

            MultiValueMap<String, Object> body =
                    new LinkedMultiValueMap<>();


            // Registered Image
            body.add(
                    "registered_image",
                    new ByteArrayResource(
                            registeredImage.getBytes()
                    ) {
                        @Override
                        public String getFilename() {
                            return registeredImage.getOriginalFilename();
                        }
                    }
            );


            // Selfie Image
            body.add(
                    "selfie_image",
                    new ByteArrayResource(
                            selfieImage.getBytes()
                    ) {
                        @Override
                        public String getFilename() {
                            return selfieImage.getOriginalFilename();
                        }
                    }
            );


            HttpEntity<MultiValueMap<String, Object>> request =
                    new HttpEntity<>(body, headers);


            ResponseEntity<FaceMatchResponse> response =
                    restTemplate.postForEntity(
                            fastApiUrl,
                            request,
                            FaceMatchResponse.class
                    );


            return response.getBody();

        } catch (Exception e) {

            return new FaceMatchResponse(
                    "Face verification failed: " + e.getMessage()
            );
        }
    }
}
