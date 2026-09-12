package com.example.fincoredigitalbankingmanagementplatform2.balancemanagement.controller;

import com.example.fincoredigitalbankingmanagementplatform2.balancemanagement.DTO.balanceDTO;
import com.example.fincoredigitalbankingmanagementplatform2.balancemanagement.service.balanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200/")
@RestController
public class balanceController {
    @Autowired
    private balanceService balanceService;
    @GetMapping("/checkBalance")
    public ResponseEntity<BigDecimal> checkBalance(@RequestParam String accountNumber, Authentication authentication){
        System.out.println("LOGIN API HIT");
        String email=authentication.getName();
        return ResponseEntity.ok(balanceService.getBalance(accountNumber,email));
    }
    @GetMapping("/recent-transactions/{accountId}")
    public ResponseEntity<List<balanceDTO>> getRecentTransactions(
            @PathVariable String accountId) {

        return ResponseEntity.ok(balanceService.getRecentTransactions(accountId));
    }
}