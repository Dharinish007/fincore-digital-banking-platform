package com.fincore.BankingManagement.Milestone1.account.controller;

import com.fincore.BankingManagement.Entities.Account;
import com.fincore.BankingManagement.Milestone1.account.BankingServices.dto.AccountResponse;
import com.fincore.BankingManagement.Milestone1.account.DTOs.AccountCreationRequest;
import com.fincore.BankingManagement.Milestone1.account.service.AccountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // Create account
    @PostMapping("/accountCreation")
    public String createAccount(
            @RequestBody AccountCreationRequest request) {

        return accountService.createAccount(request);
    }

    // Get accounts by customer
    @GetMapping("/customer/{customerId}")
    public List<AccountResponse> getAccountsByCustomer(
            @PathVariable Long customerId) {

        return accountService
                .getAccountsByCustomerId(customerId);
    }
}