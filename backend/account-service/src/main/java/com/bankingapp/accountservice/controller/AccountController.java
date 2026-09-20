package com.bankingapp.accountservice.controller;

import com.bankingapp.accountservice.dto.*;
import com.bankingapp.accountservice.enums.AccountStatus;
import com.bankingapp.accountservice.enums.AccountType;
import com.bankingapp.accountservice.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody AccountCreateRequest request) {

        AccountResponse response = accountService.createAccount(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/statistics")
    public ResponseEntity<AccountStatisticsResponse> getStatistics() {

        return ResponseEntity.ok(accountService.getStatistics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable Long id) {

        AccountResponse response = accountService.getAccountById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccountByNumber(@PathVariable String accountNumber) {

        AccountResponse response = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(required = false) AccountType accountType) {

        return ResponseEntity.ok(accountService.getAllAccounts(customerId, search, status, accountType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountResponse> updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody AccountUpdateRequest request) {

        return ResponseEntity.ok(accountService.updateAccount(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AccountResponse> updateAccountStatus(
            @PathVariable Long id,
            @Valid @RequestBody AccountStatusUpdateRequest request) {

        return ResponseEntity.ok(accountService.updateAccountStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {

        accountService.deleteAccount(id);
        return ResponseEntity.ok("Account closed successfully");
    }

    @PostMapping("/{accountNumber}/credit")
public ResponseEntity<AccountResponse> creditBalance(
        @PathVariable String accountNumber,
        @RequestParam BigDecimal amount) {

    accountService.creditBalance(accountNumber, amount);
    return ResponseEntity.ok(accountService.getAccountByNumber(accountNumber));
}

@PostMapping("/{accountNumber}/debit")
public ResponseEntity<AccountResponse> debitBalance(
        @PathVariable String accountNumber,
        @RequestParam BigDecimal amount) {

    accountService.debitBalance(accountNumber, amount);
    return ResponseEntity.ok(accountService.getAccountByNumber(accountNumber));
}

}
