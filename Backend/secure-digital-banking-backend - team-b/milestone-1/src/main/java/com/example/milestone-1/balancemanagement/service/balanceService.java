package com.example.fincoredigitalbankingmanagementplatform2.balancemanagement.service;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.accountEntity;
import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.repo.accountRepo;
import com.example.fincoredigitalbankingmanagementplatform2.balancemanagement.DTO.balanceDTO;
import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.entity.transactionEntity;
import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.repo.transactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class balanceService {
    @Autowired
    private transactionRepo repo;
    @Autowired
    private accountRepo accountRepo;
    public BigDecimal getBalance(String accountNumber, String email) {
        accountEntity account = accountRepo.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new BadCredentialsException("Account not found"));
        return account.getBalance();
    }

    public List<balanceDTO> getRecentTransactions(String accountNumber) {
        accountEntity account = accountRepo.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new BadCredentialsException("Account not found"));
        List<transactionEntity> transactions =
                repo.findTop10BySenderAccountNumberOrderByTransactionDateDesc(account);

        return transactions.stream()
                .map(transaction -> new balanceDTO(
                        transaction.getTransactionId(),
                        transaction.getAmount(),
                        transaction.getTransactionType(),
                        transaction.getStatus(),
                        transaction.getTransactionDate(),
                        transaction.getRemarks()
                ))
                .toList();
    }
}
