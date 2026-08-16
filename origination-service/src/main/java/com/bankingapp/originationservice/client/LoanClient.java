package com.bankingapp.originationservice.client;

import com.bankingapp.originationservice.dto.LoanRequest;
import com.bankingapp.originationservice.dto.LoanResponse;
import com.bankingapp.originationservice.exception.ServiceIntegrationException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class LoanClient {

    private final RestClient restClient;

    public LoanClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8084")
                .build();
    }

    public LoanResponse createLoan(
            LoanRequest request) {

        try {
            return restClient.post()
                    .uri("/api/loans")
                    .body(request)
                    .retrieve()
                    .body(LoanResponse.class);

        } catch (RestClientException e) {

            throw new ServiceIntegrationException(
                    "Loan Service is unavailable",
                    e
            );
        }
    }
}