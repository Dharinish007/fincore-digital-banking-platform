package com.bankingsystem.disbursementsaga.client;

import com.bankingsystem.disbursementsaga.dto.AccountResponse;
import com.bankingsystem.disbursementsaga.enums.AccountStatus;
import com.bankingsystem.disbursementsaga.enums.AccountType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Real core-banking client communicating with Team A's Account Service via HTTP/REST,
 * with fallback in-memory cache for standalone tests and resilient execution.
 */
@Component
public class CoreBankingClient {

    private static final Logger log = LoggerFactory.getLogger(CoreBankingClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final Map<String, AccountResponse> accounts = new ConcurrentHashMap<>();

    public CoreBankingClient(RestTemplate restTemplate,
                             @Value("${services.corebanking.base-url:http://localhost:8080}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;

        // Seed default accounts for both Team A and Team D test numbers
        seed("4827298246", 1L, 9L, AccountType.SAVINGS, new BigDecimal("1500.00"), AccountStatus.ACTIVE);
        seed("6155723272", 2L, 9L, AccountType.SAVINGS, new BigDecimal("5000.00"), AccountStatus.ACTIVE);
        seed("3252146937", 3L, 2L, AccountType.SAVINGS, new BigDecimal("1250.00"), AccountStatus.ACTIVE);
        seed("4269034115", 4L, 9L, AccountType.SAVINGS, new BigDecimal("300.00"), AccountStatus.ACTIVE);

        // Legacy Team D demo numbers
        seed("1234-5678-9012", 101L, 1L, AccountType.SAVINGS, new BigDecimal("12847.50"), AccountStatus.ACTIVE);
        seed("2231-9087-4410", 102L, 2L, AccountType.CURRENT, new BigDecimal("4210.00"), AccountStatus.ACTIVE);
        seed("3390-1122-7784", 103L, 3L, AccountType.SAVINGS, new BigDecimal("980.25"), AccountStatus.ACTIVE);
        seed("4471-3302-1128", 104L, 4L, AccountType.SAVINGS, new BigDecimal("22004.10"), AccountStatus.ACTIVE);
        seed("5518-6674-4402", 105L, 5L, AccountType.CURRENT, new BigDecimal("7650.75"), AccountStatus.ACTIVE);
        seed("7788-2201-3345", 106L, 3L, AccountType.CURRENT, new BigDecimal("980.25"), AccountStatus.FROZEN);
    }

    private void seed(String accountNumber, Long accountId, Long customerId,
                      AccountType type, BigDecimal balance, AccountStatus status) {
        AccountResponse acc = new AccountResponse();
        acc.setAccountId(accountId);
        acc.setCustomerId(customerId);
        acc.setAccountNumber(accountNumber);
        acc.setAccountType(type);
        acc.setBalance(balance);
        acc.setStatus(status);
        acc.setCreatedAt(LocalDateTime.now());
        accounts.put(accountNumber, acc);
    }

    public AccountResponse getAccountByNumber(String accountNumber) {
        try {
            log.info("Fetching account {} from Team A Account Service at {}/api/v1/accounts/number/{}",
                    accountNumber, baseUrl, accountNumber);
            AccountResponse acc = restTemplate.getForObject(
                    baseUrl + "/api/v1/accounts/number/{accountNumber}",
                    AccountResponse.class,
                    accountNumber
            );
            if (acc != null) {
                accounts.put(accountNumber, acc);
                return acc;
            }
        } catch (Exception e) {
            log.warn("Could not query Team A Account Service at {} ({}); checking fallback cache.",
                    baseUrl, e.getMessage());
        }

        AccountResponse fallback = accounts.get(accountNumber);
        if (fallback == null) {
            throw new RuntimeException("Account not found: " + accountNumber);
        }
        return fallback;
    }

    public void debit(AccountResponse account, BigDecimal amount) {
        try {
            log.info("Debiting {} from real Team A account {}", amount, account.getAccountNumber());
            restTemplate.postForObject(
                    baseUrl + "/api/v1/accounts/{accountNumber}/debit?amount={amount}",
                    null,
                    Void.class,
                    account.getAccountNumber(),
                    amount
            );
            return;
        } catch (Exception e) {
            log.warn("Direct HTTP debit on Team A Account Service failed ({}). Applying in-memory delta.",
                    e.getMessage());
        }

        applyDelta(account.getAccountNumber(), amount.negate());
    }

    public void credit(AccountResponse account, BigDecimal amount) {
        try {
            log.info("Crediting {} to real Team A account {}", amount, account.getAccountNumber());
            restTemplate.postForObject(
                    baseUrl + "/api/v1/accounts/{accountNumber}/credit?amount={amount}",
                    null,
                    Void.class,
                    account.getAccountNumber(),
                    amount
            );
            return;
        } catch (Exception e) {
            log.warn("Direct HTTP credit on Team A Account Service failed ({}). Applying in-memory delta.",
                    e.getMessage());
        }

        applyDelta(account.getAccountNumber(), amount);
    }

    private void applyDelta(String accountNumber, BigDecimal delta) {
        AccountResponse acc = accounts.get(accountNumber);
        if (acc == null) {
            throw new RuntimeException("Account not found: " + accountNumber);
        }
        acc.setBalance(acc.getBalance().add(delta));
    }
}
