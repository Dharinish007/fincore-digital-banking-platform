package com.bankingsystem.disbursementsaga.client;

import com.bankingsystem.disbursementsaga.dto.KycResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class KycServiceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public KycServiceClient(RestTemplate restTemplate,
                            @Value("${services.kyc.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public boolean isKycApproved(Long kycId) {
        try {
            KycResponseDTO response = restTemplate.getForObject(
                    baseUrl + "/api/v1/kyc/status/{kycId}",
                    KycResponseDTO.class,
                    kycId
            );
            return response != null && "APPROVED".equalsIgnoreCase(response.getStatus());
        } catch (RestClientException e) {
            throw new RuntimeException("KYC lookup failed for kycId " + kycId + ": " + e.getMessage(), e);
        }
    }
}
