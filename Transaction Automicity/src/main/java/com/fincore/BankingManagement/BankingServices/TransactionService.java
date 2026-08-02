package com.fincore.BankingManagement.BankingServices;

import com.fincore.BankingManagement.dto.TransferRequest;
import com.fincore.BankingManagement.dto.TransferResponse;

import javax.security.auth.login.AccountNotFoundException;

public interface TransactionService {
    TransferResponse transferFunds(TransferRequest transferRequest) throws AccountNotFoundException;
}
