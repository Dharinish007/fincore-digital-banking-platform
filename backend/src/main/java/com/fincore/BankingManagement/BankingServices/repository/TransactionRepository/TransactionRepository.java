package com.fincore.BankingManagement.BankingServices.repository.TransactionRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.fincore.BankingManagement.BankingServices.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> {
}
