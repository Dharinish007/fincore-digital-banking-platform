package com.digitalBanking.liveness.service;

import com.digitalBanking.liveness.dto.LivenessResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class LivenessService {

    private final RestTemplate restTemplate;

    @Value("${liveness.service.url}")
    private String livenessServiceUrl;


    public LivenessService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    // ========================================================
    // CALL FASTAPI
    // ========================================================

    public LivenessResponse verifyLiveness(
            MultipartFile image
    ) throws IOException {


        if (image == null || image.isEmpty()) {

            throw new IllegalArgumentException(
                    "Image file is required"
            );
        }


        System.out.println(
                "======================================"
        );

        System.out.println(
                "Calling FastAPI Liveness Service"
        );

        System.out.println(
                "File: " + image.getOriginalFilename()
        );

        System.out.println(
                "Size: " + image.getSize()
        );

        System.out.println(
                "FastAPI URL: "
                        + livenessServiceUrl
                        + "/liveness/verify"
        );

        System.out.println(
                "======================================"
        );


        // ====================================================
        // CREATE MULTIPART BODY
        // ====================================================

        MultiValueMap<String, Object> body =
                new LinkedMultiValueMap<>();


        // ====================================================
        // CONVERT MULTIPART FILE TO RESOURCE
        // ====================================================

        ByteArrayResource resource =
                new ByteArrayResource(
                        image.getBytes()
                ) {

                    @Override
                    public String getFilename() {

                        String filename =
                                image.getOriginalFilename();

                        if (filename == null ||
                                filename.isBlank()) {

                            return "image.jpg";
                        }

                        return filename;
                    }
                };


        // ====================================================
        // IMPORTANT
        //
        // FastAPI expects:
        //
        // uploaded_file: UploadFile = File(...)
        //
        // Therefore the key MUST be uploaded_file
        // ====================================================

        body.add(
                "uploaded_file",
                resource
        );


        // ====================================================
        // HEADERS
        // ====================================================

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.MULTIPART_FORM_DATA
        );


        // ====================================================
        // CREATE HTTP REQUEST
        // ====================================================

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(
                        body,
                        headers
                );


        // ====================================================
        // FASTAPI URL
        // ====================================================

        String url =
                livenessServiceUrl
                        + "/liveness/verify";


        // ====================================================
        // CALL FASTAPI
        // ====================================================

        ResponseEntity<LivenessResponse> response =
                restTemplate.exchange(

                        url,

                        HttpMethod.POST,

                        request,

                        LivenessResponse.class
                );


        System.out.println(
                "FastAPI response status: "
                        + response.getStatusCode()
        );


        return response.getBody();
    }
}