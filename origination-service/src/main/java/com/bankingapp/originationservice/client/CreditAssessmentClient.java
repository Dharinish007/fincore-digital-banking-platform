package com.bankingapp.originationservice.client;

import com.bankingapp.originationservice.dto.CreditAssessmentRequest;
import com.bankingapp.originationservice.dto.CreditAssessmentResponse;
import com.bankingapp.originationservice.exception.ServiceIntegrationException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class CreditAssessmentClient {

    private final RestClient restClient;

    public CreditAssessmentClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8084")
                .build();
    }

    public CreditAssessmentResponse assess(
            CreditAssessmentRequest request) {

        try {
            return restClient.post()
                    .uri("/api/credit/assess")
                    .body(request)
                    .retrieve()
                    .body(CreditAssessmentResponse.class);

        } catch (RestClientException e) {

            throw new ServiceIntegrationException(
                    "Credit Assessment Service is unavailable",
                    e
            );
        }
    }
}