package com.bankingsystem.disbursementsaga.client;

import com.bankingsystem.disbursementsaga.dto.AccountResponse;
import com.bankingsystem.disbursementsaga.enums.AccountStatus;
import com.bankingsystem.disbursementsaga.enums.AccountType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * MOCK core-banking client — no HTTP calls, no dependency on account-service
 * being up. Holds dummy accounts in memory so the saga can be demoed/tested
 * standalone. Swap this back to a real RestTemplate client once everyone's
 * services run on stable, non-clashing ports.
 */
@Component
public class CoreBankingClient {

    private final Map<String, AccountResponse> accounts = new ConcurrentHashMap<>();

    public CoreBankingClient() {
        seed("1234-5678-9012", 1L, 1L, AccountType.SAVINGS, new BigDecimal("12847.50"), AccountStatus.ACTIVE);
        seed("2231-9087-4410", 2L, 2L, AccountType.CURRENT, new BigDecimal("4210.00"), AccountStatus.ACTIVE);
        seed("3390-1122-7784", 3L, 3L, AccountType.SAVINGS, new BigDecimal("980.25"), AccountStatus.ACTIVE);
        seed("4471-3302-1128", 4L, 4L, AccountType.SAVINGS, new BigDecimal("22004.10"), AccountStatus.ACTIVE);
        seed("5518-6674-4402", 5L, 5L, AccountType.CURRENT, new BigDecimal("7650.75"), AccountStatus.ACTIVE);
        seed("7788-2201-3345", 6L, 3L, AccountType.CURRENT, new BigDecimal("980.25"), AccountStatus.FROZEN);
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
        AccountResponse acc = accounts.get(accountNumber);
        if (acc == null) {
            throw new RuntimeException("Account not found: " + accountNumber);
        }
        return acc;
    }

    public void debit(AccountResponse account, BigDecimal amount) {
        applyDelta(account.getAccountNumber(), amount.negate());
    }

    public void credit(AccountResponse account, BigDecimal amount) {
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
