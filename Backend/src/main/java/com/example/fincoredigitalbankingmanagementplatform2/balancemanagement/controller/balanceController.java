package com.example.fincoredigitalbankingmanagementplatform2.balancemanagement.controller;

import com.example.fincoredigitalbankingmanagementplatform2.balancemanagement.DTO.balanceDTO;
import com.example.fincoredigitalbankingmanagementplatform2.balancemanagement.service.balanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
public class balanceController {
    @Autowired
    private balanceService balanceService;
    @GetMapping("/checkBalance")
    public ResponseEntity<BigDecimal> checkBalance(@RequestParam String accountNumber, Authentication authentication){
        String email=authentication.getName();
        return ResponseEntity.ok(balanceService.getBalance(accountNumber,email));
    }
    @GetMapping("/recent-transactions/{accountId}")
    public ResponseEntity<List<balanceDTO>> getRecentTransactions(
            @PathVariable String accountId) {

        return ResponseEntity.ok(balanceService.getRecentTransactions(accountId));
    }
}