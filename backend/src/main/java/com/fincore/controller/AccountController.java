package com.fincore.controller;

import com.fincore.dto.ApiResponse;
import com.fincore.dto.DepositRequest;
import com.fincore.dto.TransferRequest;
import com.fincore.dto.WithdrawRequest;
import com.fincore.entity.Account;
import com.fincore.entity.Transaction;
import com.fincore.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/core/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Account>>> getAllAccounts() {
        return ResponseEntity.ok(ApiResponse.ok("Accounts retrieved successfully", accountService.getAllAccounts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Account>> getAccountById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Account retrieved", accountService.getAccountById(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Account>>> getAccountsByCustomer(@PathVariable String customerId) {
        return ResponseEntity.ok(ApiResponse.ok("Customer accounts retrieved", accountService.getAccountsByCustomerId(customerId)));
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<Transaction>> deposit(@Valid @RequestBody DepositRequest request) {
        try {
            Transaction txn = accountService.deposit(request);
            return ResponseEntity.ok(ApiResponse.ok("Cash deposit processed successfully", txn));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<Transaction>> withdraw(@Valid @RequestBody WithdrawRequest request) {
        try {
            Transaction txn = accountService.withdraw(request);
            return ResponseEntity.ok(ApiResponse.ok("Cash withdrawal processed successfully", txn));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<Transaction>> transfer(@Valid @RequestBody TransferRequest request) {
        try {
            Transaction txn = accountService.transfer(request);
            return ResponseEntity.ok(ApiResponse.ok("Funds transfer processed successfully", txn));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/freeze")
    public ResponseEntity<ApiResponse<Account>> freeze(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String reason = body.getOrDefault("reason", "Administrative Lockout");
            String performedBy = body.getOrDefault("performedBy", "SUPERVISOR");
            Account acc = accountService.freezeAccount(id, reason, performedBy);
            return ResponseEntity.ok(ApiResponse.ok("Account frozen successfully", acc));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/unfreeze")
    public ResponseEntity<ApiResponse<Account>> unfreeze(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String reason = body.getOrDefault("reason", "Four-eyes review clear");
            String performedBy = body.getOrDefault("performedBy", "SUPERVISOR");
            Account acc = accountService.unfreezeAccount(id, reason, performedBy);
            return ResponseEntity.ok(ApiResponse.ok("Account unfrozen successfully", acc));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
