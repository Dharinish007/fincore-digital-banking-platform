package com.fincore.loan.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fincore.loan.dto.CustomerResponse;
import com.fincore.loan.exception.IntegrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
@Slf4j
public class CustomerClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public CustomerClient(
            RestClient.Builder builder,
            @Value("${services.customer-service.url:http://localhost:8081/api/v1/customers}") String customerServiceUrl,
            ObjectMapper objectMapper) {
        this.restClient = builder.baseUrl(customerServiceUrl).build();
        this.objectMapper = objectMapper;
    }

    public CustomerResponse getCustomerById(Long customerId) {
        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        try {
            String rawJson = restClient.get()
                    .uri("/{id}", customerId)
                    .retrieve()
                    .body(String.class);

            if (rawJson == null || rawJson.trim().isEmpty()) {
                return null;
            }

            JsonNode root = objectMapper.readTree(rawJson);
            if (root.has("data") && !root.get("data").isNull()) {
                return objectMapper.treeToValue(root.get("data"), CustomerResponse.class);
            }
            return objectMapper.treeToValue(root, CustomerResponse.class);
        } catch (RestClientResponseException e) {
            log.warn("Customer service returned error: status={}, body={}", e.getStatusCode().value(), e.getResponseBodyAsString());
            throw new IntegrationException("CustomerService", e.getStatusCode().value(), "Customer lookup failed: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Failed to connect to CustomerService", e);
            throw new IntegrationException("CustomerService", "Unable to communicate with Customer Service: " + e.getMessage());
        }
    }
}
