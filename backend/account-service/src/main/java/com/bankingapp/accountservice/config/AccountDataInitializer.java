package com.bankingapp.accountservice.config;

import com.bankingapp.accountservice.client.CustomerClient;
import com.bankingapp.accountservice.client.CustomerResponse;
import com.bankingapp.accountservice.entity.Account;
import com.bankingapp.accountservice.enums.AccountStatus;
import com.bankingapp.accountservice.enums.AccountType;
import com.bankingapp.accountservice.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class AccountDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AccountDataInitializer.class);
    private final AccountRepository accountRepository;
    private final CustomerClient customerClient;

    public AccountDataInitializer(AccountRepository accountRepository, CustomerClient customerClient) {
        this.accountRepository = accountRepository;
        this.customerClient = customerClient;
    }

    @Override
    public void run(String... args) {
        log.info("Verifying and stabilizing Account Service seed state...");

        // Ensure default accounts exist for known customers if table is empty or missing them
        if (accountRepository.count() == 0) {
            log.info("No accounts present in database. Seeding initial accounts...");

            // If Customer 9 (John Doe) exists, create initial savings account
            CustomerResponse cust9 = customerClient.getCustomerById(9L);
            Long johnId = cust9 != null ? cust9.getId() : 9L;

            Account johnAcc1 = new Account(null, johnId, "4827298246", AccountType.SAVINGS, new BigDecimal("1500.00"), AccountStatus.ACTIVE, LocalDateTime.now());
            Account johnAcc2 = new Account(null, johnId, "4269034115", AccountType.SAVINGS, new BigDecimal("300.00"), AccountStatus.ACTIVE, LocalDateTime.now());
            Account johnAcc3 = new Account(null, johnId, "6155723272", AccountType.SAVINGS, new BigDecimal("5000.00"), AccountStatus.ACTIVE, LocalDateTime.now());

            accountRepository.saveAll(List.of(johnAcc1, johnAcc2, johnAcc3));
            log.info("Seeded 3 accounts for John Doe (customerId={})", johnId);

            // If Customer 2 (Ravana) exists, create initial savings account
            CustomerResponse cust2 = customerClient.getCustomerById(2L);
            Long ravanaId = cust2 != null ? cust2.getId() : 2L;

            Account ravanaAcc = new Account(null, ravanaId, "3252146937", AccountType.SAVINGS, new BigDecimal("1250.00"), AccountStatus.ACTIVE, LocalDateTime.now());
            accountRepository.save(ravanaAcc);
            log.info("Seeded account for Ravana Kumar (customerId={})", ravanaId);
        } else {
            log.info("Account table already contains {} accounts.", accountRepository.count());
        }
    }
}
