package com.fincore.BankingManagement.Milestone4.livenessdetection.service;

import com.fincore.BankingManagement.Milestone4.livenessdetection.dto.LivenessResponse;
import com.fincore.BankingManagement.Milestone4.livenessdetection.dto.LivenessResultData;
import com.fincore.BankingManagement.Milestone4.livenessdetection.model.LivenessVerification;
import com.fincore.BankingManagement.Milestone4.livenessdetection.repository.LivenessVerificationRepository;

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
    private final LivenessVerificationRepository livenessVerificationRepository;

    @Value("${liveness.service.url}")
    private String livenessServiceUrl;

    public LivenessService(
            RestTemplate restTemplate,
            LivenessVerificationRepository livenessVerificationRepository) {

        this.restTemplate = restTemplate;
        this.livenessVerificationRepository = livenessVerificationRepository;
    }

    public LivenessResponse verifyLiveness(MultipartFile image) throws IOException {

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        System.out.println("======================================");
        System.out.println("Calling FastAPI Liveness Service");
        System.out.println("File: " + image.getOriginalFilename());
        System.out.println("Size: " + image.getSize());
        System.out.println(
                "FastAPI URL: "
                        + livenessServiceUrl
                        + "/liveness/verify"
        );
        System.out.println("======================================");

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        ByteArrayResource resource =
                new ByteArrayResource(image.getBytes()) {

                    @Override
                    public String getFilename() {

                        String filename =
                                image.getOriginalFilename();

                        if (filename == null || filename.isBlank()) {
                            return "image.jpg";
                        }

                        return filename;
                    }
                };

        // FastAPI expects uploaded_file
        body.add("uploaded_file", resource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        String url =
                livenessServiceUrl + "/liveness/verify";

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

        LivenessResponse result = response.getBody();

        // Save result in database
        if (result != null) {

            LivenessVerification verification =
                    new LivenessVerification();

            verification.setSuccess(result.isSuccess());
            verification.setRequestId(result.getRequestId());

            // Successful liveness response
            if (result.getData() != null) {

                LivenessResultData data =
                        result.getData();

                verification.setPassed(data.isPassed());

                verification.setConfidenceScore(
                        data.getConfidenceScore()
                );

                verification.setLivenessScore(
                        data.getLivenessScore()
                );

                verification.setVerificationStatus(
                        data.getVerificationStatus()
                );
            }

            // Save error message if FastAPI returned an error
            if (result.getError() != null) {

                verification.setMessage(
                        result.getError().getMessage()
                );
            }

            livenessVerificationRepository.save(verification);
        }

        return result;
    }
}