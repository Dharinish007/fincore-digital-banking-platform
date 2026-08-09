package com.fincore.BankingManagement.account.controller;

import com.fincore.BankingManagement.Entities.Account;
import com.fincore.BankingManagement.account.DTOs.AccountCreationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import com.fincore.BankingManagement.account.service.AccountService;

@RestController
@RequestMapping("/accountCreation")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    public String createAccount(@RequestBody AccountCreationRequest request) {
        accountService.createAccount(request);
        return "Account created Successfully";
    }
}