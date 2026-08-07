package com.fincore.BankingManagement.controller;

import com.fincore.BankingManagement.dto.*;
import com.fincore.BankingManagement.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/balance-accuracy")
    public ResponseEntity<List<BankAccountDto>> getBalanceAccuracyAccounts() {
        return ResponseEntity.ok(accountService.getBalanceAccuracyAccounts());
    }

    @GetMapping("/{accountNo}")
    public ResponseEntity<BankAccountDto> getAccountByNo(@PathVariable String accountNo) {
        return ResponseEntity.ok(accountService.getAccountByNo(accountNo));
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/{accountNo}/verify")
    public ResponseEntity<BankAccountDto> verifyAccount(
            @PathVariable String accountNo,
            @RequestBody(required = false) VerifyAccountRequest request) {
        return ResponseEntity.ok(accountService.verifyAccount(accountNo, request));
    }

    @PostMapping("/{accountNo}/freeze")
    public ResponseEntity<BankAccountDto> freezeAccount(
            @PathVariable String accountNo,
            @RequestBody(required = false) FreezeAccountRequest request) {
        return ResponseEntity.ok(accountService.freezeAccount(accountNo, request));
    }
}
