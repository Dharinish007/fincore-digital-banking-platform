package com.fincore.BankingManagement.balanceaccuracy.service;

import com.fincore.BankingManagement.BankingServices.Enums.TransactionType;
import com.fincore.BankingManagement.BankingServices.model.Account;
import com.fincore.BankingManagement.BankingServices.model.Transaction;
import com.fincore.BankingManagement.balanceaccuracy.repository.BalanceAccuracyRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BalanceAccuracyService {

    private final BalanceAccuracyRepository transactionRepository;

    public BalanceAccuracyService(BalanceAccuracyRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public BigDecimal calculateExpectedBalance(Account account) {

        BigDecimal balance = BigDecimal.ZERO;

        List<Transaction> transactions =
                transactionRepository.findByAccount_AccountNo(account.getAccountNo());

        for (Transaction transaction : transactions) {

            BigDecimal amount = transaction.getAmount();

            if (transaction.getTransactionType() == TransactionType.Deposit) {
                balance = balance.add(amount);

            } else if (transaction.getTransactionType() == TransactionType.Withdraw) {
                balance = balance.subtract(amount);

            } else if (transaction.getTransactionType() == TransactionType.Transfer) {
                balance = balance.subtract(amount);
            }
        }

        return balance;
    }

    public boolean isBalanceAccurate(Account account) {

        BigDecimal expectedBalance = calculateExpectedBalance(account);

        BigDecimal actualBalance = account.getBalance();

        return expectedBalance.compareTo(actualBalance) == 0;
    }
}