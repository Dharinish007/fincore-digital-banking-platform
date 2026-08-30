package com.bankingsystem.complianceservice.client;

import com.bankingsystem.complianceservice.dto.KycProfileDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
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

    public KycProfileDTO getProfile(Long kycId) {
        KycProfileDTO profile = restTemplate.getForObject(
                baseUrl + "/api/v1/kyc/status/{kycId}",
                KycProfileDTO.class,
                kycId
        );
        if (profile == null) {
            throw new RuntimeException("KYC profile not found for kycId " + kycId);
        }
        return profile;
    }
}
