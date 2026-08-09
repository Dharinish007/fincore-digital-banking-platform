package com.fincore.BankingManagement.balanceaccuracy.repository;

import com.fincore.BankingManagement.BankingServices.Enums.TransactionType;
import com.fincore.BankingManagement.Entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BalanceAccuracyRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccount_AccountNo(String accountNo);

    List<Transaction> findByAccount_AccountNoAndTransactionType(
            String accountNo,
            TransactionType transactionType
    );
}