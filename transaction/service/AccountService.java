package com.fincore.transaction.service;

import com.fincore.transaction.dto.AccountResponse;
import com.fincore.transaction.dto.CreateAccountRequest;
import com.fincore.transaction.entity.Account;
import com.fincore.transaction.exception.AccountNotFoundException;
import com.fincore.transaction.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .customerName(request.getCustomerName())
                .accountType(request.getAccountType())
                .balance(request.getOpeningBalance())
                .status("ACTIVE")
                .build();

        Account saved = accountRepository.save(account);
        return AccountResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public AccountResponse getAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));
        return AccountResponse.from(account);
    }

    private String generateAccountNumber() {
        String candidate;
        do {
            candidate = String.format("%04d-%04d-%04d", RANDOM.nextInt(10000), RANDOM.nextInt(10000), RANDOM.nextInt(10000));
        } while (accountRepository.existsByAccountNumber(candidate));
        return candidate;
    }
}
