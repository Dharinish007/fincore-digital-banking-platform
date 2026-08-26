package com.fincore.BankingManagement.Account.Service;

import java.util.List;

import com.fincore.BankingManagement.models.Account;
import org.springframework.stereotype.Service;

import com.fincore.BankingManagement.Account.Repository.AccountRepository;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerId(customerId);
    }
}