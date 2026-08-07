package com.fincore.BankingManagement.account.service;

import com.fincore.BankingManagement.account.repository.AccoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fincore.BankingManagement.account.entity.Account;

@Service
public class AccountService {

    @Autowired
    private AccoRepository accountRepository;

    public Account createAccount(Account account) {

        // Check whether account number already exists
        if (accountRepository.existsByAccountNo(account.getAccountNo())) {
            throw new RuntimeException("Account already exists");
        }

        // Create account if account number is unique
        return accountRepository.save(account);
    }
}