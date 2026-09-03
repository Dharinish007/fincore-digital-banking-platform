package com.digitalBanking.documentOCR.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class OcrApiClient {

    private final RestTemplate restTemplate;

    @Value("${ocr.service.url}")
    private String ocrServiceUrl;

    public OcrApiClient() {
        this.restTemplate = new RestTemplate();
    }

    public OcrApiResponse extractText(MultipartFile document) {

        try {
            ByteArrayResource resource =
                    new ByteArrayResource(document.getBytes()) {

                        @Override
                        public String getFilename() {
                            return document.getOriginalFilename();
                        }
                    };

            MultiValueMap<String, Object> body =
                    new LinkedMultiValueMap<>();

            body.add("document", resource);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.MULTIPART_FORM_DATA
            );

            HttpEntity<MultiValueMap<String, Object>> request =
                    new HttpEntity<>(body, headers);

            return restTemplate.postForObject(
                    ocrServiceUrl + "/ocr",
                    request,
                    OcrApiResponse.class
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to send document to OCR service",
                    e
            );
        }
    }
}