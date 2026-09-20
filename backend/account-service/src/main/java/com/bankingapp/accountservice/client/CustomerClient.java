package com.bankingapp.accountservice.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class CustomerClient {

    private static final Logger log = LoggerFactory.getLogger(CustomerClient.class);
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
            return null;
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
            log.warn("Customer lookup failed for id={}: status={}, response={}", customerId, e.getStatusCode().value(), e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            log.warn("Customer lookup error for id={}: {}", customerId, e.getMessage());
            return null;
        }
    }

    public boolean existsById(Long customerId) {
        if (customerId == null) {
            return false;
        }
        CustomerResponse customer = getCustomerById(customerId);
        return customer != null && customer.getId() != null;
    }
}
