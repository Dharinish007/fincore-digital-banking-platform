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
        return accountRepository.save(account);
    }
}