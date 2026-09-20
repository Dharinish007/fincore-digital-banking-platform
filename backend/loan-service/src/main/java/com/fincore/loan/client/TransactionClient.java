package com.fincore.loan.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fincore.loan.dto.TransactionResponse;
import com.fincore.loan.exception.IntegrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class TransactionClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public TransactionClient(
            RestClient.Builder builder,
            @Value("${services.transaction-service.url:http://localhost:8083/api/v1/transactions}") String transactionServiceUrl,
            ObjectMapper objectMapper) {
        this.restClient = builder.baseUrl(transactionServiceUrl).build();
        this.objectMapper = objectMapper;
    }

    public List<TransactionResponse> getTransactionsByCustomerId(Long customerId) {
        if (customerId == null) return List.of();
        try {
            String rawJson = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/customer/{customerId}")
                            .queryParam("size", 100)
                            .build(customerId))
                    .retrieve()
                    .body(String.class);

            return parseTransactions(rawJson);
        } catch (Exception e) {
            log.warn("Failed to fetch customer transactions from TransactionService: {}", e.getMessage());
            return List.of();
        }
    }

    public List<TransactionResponse> getTransactionsByAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) return List.of();
        try {
            String rawJson = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/history/{accountNumber}")
                            .queryParam("size", 100)
                            .build(accountNumber.trim()))
                    .retrieve()
                    .body(String.class);

            return parseTransactions(rawJson);
        } catch (Exception e) {
            log.warn("Failed to fetch account transactions from TransactionService: {}", e.getMessage());
            return List.of();
        }
    }

    public TransactionResponse recordDisbursementTransaction(String accountNumber, java.math.BigDecimal amount, String loanNumber) {
        try {
            java.util.Map<String, Object> request = java.util.Map.of(
                    "accountNumber", accountNumber,
                    "amount", amount,
                    "remarks", "Loan Disbursement - " + loanNumber
            );

            String rawJson = restClient.post()
                    .uri("/deposit")
                    .body(request)
                    .retrieve()
                    .body(String.class);

            if (rawJson == null || rawJson.trim().isEmpty()) return null;
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode data = root.has("data") && !root.get("data").isNull() ? root.get("data") : root;
            return objectMapper.treeToValue(data, TransactionResponse.class);
        } catch (RestClientResponseException e) {
            log.error("Transaction recording failed: status={}, body={}", e.getStatusCode().value(), e.getResponseBodyAsString());
            throw new IntegrationException("TransactionService", e.getStatusCode().value(), "Transaction recording failed: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Failed to record transaction in TransactionService", e);
            throw new IntegrationException("TransactionService", "Transaction recording communication failed: " + e.getMessage());
        }
    }

    private List<TransactionResponse> parseTransactions(String rawJson) {
        if (rawJson == null || rawJson.trim().isEmpty()) {
            return List.of();
        }
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode items = null;

            if (root.has("content") && root.get("content").isArray()) {
                items = root.get("content");
            } else if (root.has("data") && root.get("data").has("content") && root.get("data").get("content").isArray()) {
                items = root.get("data").get("content");
            } else if (root.isArray()) {
                items = root;
            }

            if (items != null) {
                List<TransactionResponse> list = new ArrayList<>();
                for (JsonNode item : items) {
                    list.add(objectMapper.treeToValue(item, TransactionResponse.class));
                }
                return list;
            }
        } catch (Exception e) {
            log.warn("Error parsing transactions JSON: {}", e.getMessage());
        }
        return List.of();
    }
}
