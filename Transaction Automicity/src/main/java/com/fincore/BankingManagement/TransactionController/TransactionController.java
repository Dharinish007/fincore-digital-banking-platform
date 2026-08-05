package com.fincore.BankingManagement.TransactionController;

import com.fincore.BankingManagement.BankingServices.TransactionService;
import com.fincore.BankingManagement.dto.TransferRequest;
import com.fincore.BankingManagement.dto.TransferResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;

@RestController
@RequestMapping("/api/transfer")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    @PostMapping("/transfer")
    public ResponseEntity<TransferResponse> transfer(@RequestBody TransferRequest transferRequest) throws AccountNotFoundException {
        return ResponseEntity.ok(
                transactionService.transferFunds(transferRequest));
    }
    @GetMapping("")
    public String GetMapping(){
        return "This is fincore Banking Management Api";
    }
}
