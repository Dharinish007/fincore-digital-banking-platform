package com.fincore.BankingManagement.BankingServices.TransactionController;

import com.fincore.BankingManagement.BankingServices.Impl.TransactionServiceImp;
import com.fincore.BankingManagement.BankingServices.TransactionService;
import com.fincore.BankingManagement.BankingServices.dto.TransferRequest;
import com.fincore.BankingManagement.BankingServices.dto.TransferResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/transfer")
@RequiredArgsConstructor
public class TransactionController {
    @Autowired
    TransactionServiceImp transactionservice;
    private final TransactionService transactionService;
    @PostMapping("/transfer")
    public ResponseEntity<TransferResponse> transfer(@RequestBody TransferRequest transferRequest) throws AccountNotFoundException {
        return ResponseEntity.ok(
                transactionService.transferFunds(transferRequest));
    }

    @GetMapping("/enquiry/{accountNumber}")
    public ResponseEntity<?> balanceEnquiry(@PathVariable String accountNumber) {
       BigDecimal balance =transactionservice.balanceEnquiry(accountNumber);
        return ResponseEntity.ok("Balance for account " + accountNumber + " is: " + balance);
    }

    @GetMapping("")
    public String GetMapping(){
        return "This is fincore Banking Management Api";
    }

    @GetMapping("/getReceiver/{receiverAccountNumber}")
    public ResponseEntity<?> getReceiver(@PathVariable String receiverAccountNumber) {
        return transactionservice.getReceiver(receiverAccountNumber);
    }
}
