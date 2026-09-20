package com.fincore.loan.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fincore.loan.dto.AccountResponse;
import com.fincore.loan.exception.IntegrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class AccountClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public AccountClient(
            RestClient.Builder builder,
            @Value("${services.account-service.url:http://localhost:8082/api/v1/accounts}") String accountServiceUrl,
            ObjectMapper objectMapper) {
        this.restClient = builder.baseUrl(accountServiceUrl).build();
        this.objectMapper = objectMapper;
    }

    public AccountResponse getAccountById(Long accountId) {
        if (accountId == null) return null;
        try {
            String rawJson = restClient.get()
                    .uri("/{id}", accountId)
                    .retrieve()
                    .body(String.class);
            return parseAccount(rawJson);
        } catch (RestClientResponseException e) {
            log.warn("Account lookup by id failed: status={}, body={}", e.getStatusCode().value(), e.getResponseBodyAsString());
            throw new IntegrationException("AccountService", e.getStatusCode().value(), "Account lookup failed: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Failed to connect to AccountService", e);
            throw new IntegrationException("AccountService", "Unable to communicate with Account Service: " + e.getMessage());
        }
    }

    public AccountResponse getAccountByNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) return null;
        try {
            String rawJson = restClient.get()
                    .uri("/number/{accountNumber}", accountNumber.trim())
                    .retrieve()
                    .body(String.class);
            return parseAccount(rawJson);
        } catch (RestClientResponseException e) {
            log.warn("Account lookup by number failed: status={}, body={}", e.getStatusCode().value(), e.getResponseBodyAsString());
            throw new IntegrationException("AccountService", e.getStatusCode().value(), "Account lookup failed: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Failed to connect to AccountService", e);
            throw new IntegrationException("AccountService", "Unable to communicate with Account Service: " + e.getMessage());
        }
    }

    public List<AccountResponse> getAccountsByCustomerId(Long customerId) {
        if (customerId == null) return List.of();
        try {
            String rawJson = restClient.get()
                    .uri(uriBuilder -> uriBuilder.queryParam("customerId", customerId).build())
                    .retrieve()
                    .body(String.class);

            if (rawJson == null || rawJson.trim().isEmpty()) {
                return List.of();
            }

            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode arrayNode = root.has("data") ? root.get("data") : root;
            if (arrayNode.isArray()) {
                List<AccountResponse> list = new ArrayList<>();
                for (JsonNode node : arrayNode) {
                    list.add(objectMapper.treeToValue(node, AccountResponse.class));
                }
                return list;
            }
            return List.of();
        } catch (Exception e) {
            log.warn("Failed to get accounts for customer {}: {}", customerId, e.getMessage());
            return List.of();
        }
    }

    public AccountResponse credit(String accountNumber, BigDecimal amount) {
        if (accountNumber == null || amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid account number or credit amount");
        }
        try {
            String rawJson = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/{accountNumber}/credit")
                            .queryParam("amount", amount)
                            .build(accountNumber))
                    .retrieve()
                    .body(String.class);
            return parseAccount(rawJson);
        } catch (RestClientResponseException e) {
            log.error("Account credit failed: status={}, body={}", e.getStatusCode().value(), e.getResponseBodyAsString());
            throw new IntegrationException("AccountService", e.getStatusCode().value(), "Account credit failed: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Failed to credit account in AccountService", e);
            throw new IntegrationException("AccountService", "Account credit communication failed: " + e.getMessage());
        }
    }

    private AccountResponse parseAccount(String rawJson) throws Exception {
        if (rawJson == null || rawJson.trim().isEmpty()) {
            return null;
        }
        JsonNode root = objectMapper.readTree(rawJson);
        if (root.has("data") && !root.get("data").isNull()) {
            return objectMapper.treeToValue(root.get("data"), AccountResponse.class);
        }
        return objectMapper.treeToValue(root, AccountResponse.class);
    }
}
