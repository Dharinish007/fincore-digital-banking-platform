package com.fincore.BankingManagement.Milestone1.account.BankingServices.repository.TransactionRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.fincore.BankingManagement.Entities.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> {
}
