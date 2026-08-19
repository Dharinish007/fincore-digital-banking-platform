package com.fincore.transaction.config;

import com.fincore.transaction.entity.Account;
import com.fincore.transaction.entity.AccountType;
import com.fincore.transaction.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Seeds two sample accounts on startup so you can hit the API immediately
 * without first creating an account. Safe to delete for production use.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AccountRepository accountRepository;

    @Override
    public void run(String... args) {
        if (accountRepository.count() == 0) {
            accountRepository.save(Account.builder()
                    .accountNumber("1234-5678-9012")
                    .customerName("John Smith")
                    .accountType(AccountType.SAVINGS)
                    .balance(new BigDecimal("12847.50"))
                    .status("ACTIVE")
                    .build());

            accountRepository.save(Account.builder()
                    .accountNumber("2222-3333-4444")
                    .customerName("Priya Nair")
                    .accountType(AccountType.CURRENT)
                    .balance(new BigDecimal("5000.00"))
                    .status("ACTIVE")
                    .build());

            System.out.println(">>> Seeded sample accounts: 1234-5678-9012 (John Smith), 2222-3333-4444 (Priya Nair)");
        }
    }
}
