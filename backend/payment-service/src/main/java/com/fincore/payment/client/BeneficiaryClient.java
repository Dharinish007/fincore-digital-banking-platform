package com.fincore.payment.client;

import com.fincore.payment.client.dto.BeneficiaryClientResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Optional;

@Component
public class BeneficiaryClient {

    private static final Logger log = LoggerFactory.getLogger(BeneficiaryClient.class);

    private final RestClient restClient;

    public BeneficiaryClient(
            RestClient.Builder builder,
            @Value("${services.beneficiary-service.url:http://localhost:8086/api/v1/beneficiaries}") String beneficiaryServiceUrl) {
        this.restClient = builder.baseUrl(beneficiaryServiceUrl).build();
    }

    public Optional<BeneficiaryClientResponse> getBeneficiaryById(Long beneficiaryId) {
        if (beneficiaryId == null) {
            return Optional.empty();
        }
        try {
            BeneficiaryClientResponse response = restClient.get()
                    .uri("/{id}", beneficiaryId)
                    .retrieve()
                    .body(BeneficiaryClientResponse.class);
            return Optional.ofNullable(response);
        } catch (RestClientResponseException e) {
            log.warn("Beneficiary service responded with error: status={}, body={}", e.getStatusCode().value(), e.getResponseBodyAsString());
            return Optional.empty();
        } catch (Exception e) {
            log.info("Beneficiary service unreachable at configured URL (fallback mode): {}", e.getMessage());
            return Optional.empty();
        }
    }
}
