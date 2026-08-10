package com.fincore.BankingManagement.BankingServices;

import com.fincore.BankingManagement.BankingServices.dto.TransferRequest;
import com.fincore.BankingManagement.BankingServices.dto.TransferResponse;
import org.springframework.http.ResponseEntity;

import javax.security.auth.login.AccountNotFoundException;

public interface TransactionService {
    TransferResponse transferFunds(TransferRequest transferRequest) throws AccountNotFoundException;

    ResponseEntity<?> getReceiver(String receiverAccountNumber);
}
