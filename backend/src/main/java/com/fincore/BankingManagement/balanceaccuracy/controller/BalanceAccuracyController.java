package com.fincore.BankingManagement.balanceaccuracy.controller;

import com.fincore.BankingManagement.BankingServices.model.Account;
import com.fincore.BankingManagement.BankingServices.repository.TransactionRepository.AccountRepositery.AccountRepository;
import com.fincore.BankingManagement.balanceaccuracy.service.BalanceAccuracyService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/balance-accuracy")
public class BalanceAccuracyController {

    private final BalanceAccuracyService balanceAccuracyService;
    private final AccountRepository accountRepository;

    public BalanceAccuracyController(
            BalanceAccuracyService balanceAccuracyService,
            AccountRepository accountRepository) {

        this.balanceAccuracyService = balanceAccuracyService;
        this.accountRepository = accountRepository;
    }

    @GetMapping("/{accountNo}")
    public ResponseEntity<Map<String, Object>> checkBalanceAccuracy(
            @PathVariable String accountNo) {

        Account account = accountRepository.findByAccountNo(accountNo)
                .orElseThrow(() ->
                        new RuntimeException("Account not found: " + accountNo));

        BigDecimal expectedBalance =
                balanceAccuracyService.calculateExpectedBalance(account);

        BigDecimal actualBalance = account.getBalance();

        boolean accurate =
                balanceAccuracyService.isBalanceAccurate(account);

        Map<String, Object> response = new HashMap<>();

        response.put("accountNo", accountNo);
        response.put("actualBalance", actualBalance);
        response.put("expectedBalance", expectedBalance);
        response.put("balanceAccurate", accurate);

        return ResponseEntity.ok(response);
    }
}