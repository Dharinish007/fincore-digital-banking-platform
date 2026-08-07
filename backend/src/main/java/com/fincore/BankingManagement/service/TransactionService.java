package com.fincore.BankingManagement.service;

import com.fincore.BankingManagement.dto.TransactionDto;
import com.fincore.BankingManagement.dto.TransferRequest;
import com.fincore.BankingManagement.dto.TransferResponse;

import java.util.List;

public interface TransactionService {
    List<TransactionDto> getAllTransactions();
    TransactionDto getTransactionById(String id);
    TransferResponse transferFunds(TransferRequest request);
    TransactionDto retryTransaction(String id);
}
