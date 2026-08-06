package com.fincore.BankingManagement.account.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fincore.BankingManagement.account.entity.Account;
import com.fincore.BankingManagement.account.service.AccountService;

@RestController
@RequestMapping("/accountCreation")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    public String createAccount(@RequestBody Account account) {
        accountService.createAccount(account);
        return "Account created";
    }
}