package com.bankingsystem.disbursementsaga.client;

import com.bankingsystem.disbursementsaga.dto.ComplianceCheckResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class ComplianceCheckClient {
    private final RestTemplate restTemplate;
    private final String baseUrl;

    public ComplianceCheckClient(RestTemplate restTemplate,
                                 @Value("${services.compliance.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public ComplianceCheckResponse check(Long kycId, BigDecimal amount, String performedBy) {
        ComplianceCheckResponse response = restTemplate.postForObject(
                baseUrl + "/api/compliance/check",
                Map.of("kycId", kycId, "amount", amount, "performedBy", performedBy == null ? "SYSTEM" : performedBy),
                ComplianceCheckResponse.class
        );
        if (response == null) {
            throw new RuntimeException("Compliance check returned no response");
        }
        return response;
    }
}
