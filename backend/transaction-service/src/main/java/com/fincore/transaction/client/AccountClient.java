package com.fincore.transaction.client;

import com.fincore.transaction.dto.AccountResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import com.fincore.transaction.exception.AccountServiceException;
import org.springframework.web.client.RestClientResponseException;
import java.math.BigDecimal;

@Component
public class AccountClient {

    private final RestClient restClient;

    public AccountClient(
            RestClient.Builder builder,
            @Value("${services.account-service.url}") String accountServiceUrl) {

        this.restClient = builder
                .baseUrl(accountServiceUrl)
                .build();
    }


   public AccountResponse credit(String accountNumber, BigDecimal amount) {
    try {
        return restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/{accountNumber}/credit")
                        .queryParam("amount", amount)
                        .build(accountNumber))
                .retrieve()
                .body(AccountResponse.class);
    } catch (RestClientResponseException e) {
        throw new AccountServiceException(
                e.getStatusCode().value(),
                e.getResponseBodyAsString()
        );
    }
}

    public AccountResponse debit(String accountNumber, BigDecimal amount) {
        try {
            return restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/{accountNumber}/debit")
                            .queryParam("amount", amount)
                            .build(accountNumber))
                    .retrieve()
                    .body(AccountResponse.class);
        } catch (RestClientResponseException e) {
            throw new AccountServiceException(
                    e.getStatusCode().value(),
                    e.getResponseBodyAsString()
            );
        }
    }

    public java.util.List<AccountResponse> getAccountsByCustomerId(Long customerId) {
        try {
            AccountResponse[] accounts = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("customerId", customerId)
                            .build())
                    .retrieve()
                    .body(AccountResponse[].class);
            return accounts != null ? java.util.List.of(accounts) : java.util.List.of();
        } catch (Exception e) {
            return java.util.List.of();
        }
    }

    public AccountResponse getAccountByNumber(String accountNumber) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/number/{accountNumber}")
                            .build(accountNumber))
                    .retrieve()
                    .body(AccountResponse.class);
        } catch (RestClientResponseException e) {
            throw new AccountServiceException(e.getStatusCode().value(), e.getResponseBodyAsString());
        }
    }

    public AccountResponse getAccountById(Long id) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/{id}")
                            .build(id))
                    .retrieve()
                    .body(AccountResponse.class);
        } catch (RestClientResponseException e) {
            throw new AccountServiceException(e.getStatusCode().value(), e.getResponseBodyAsString());
        }
    }

    public String resolveAccountNumber(String idOrNumber) {
        if (idOrNumber == null || idOrNumber.trim().isEmpty()) {
            return null;
        }
        String clean = idOrNumber.trim();
        // If it looks like an internal ID (1-6 digits), try looking up by ID first
        if (clean.matches("^\\d{1,6}$")) {
            try {
                AccountResponse acc = getAccountById(Long.parseLong(clean));
                if (acc != null && acc.getAccountNumber() != null) {
                    return acc.getAccountNumber();
                }
            } catch (Exception ignored) {}
        }
        return clean;
    }
}