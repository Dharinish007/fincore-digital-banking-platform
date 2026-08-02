package com.fincore.BankingManagement.Repositery.TransactionRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.fincore.BankingManagement.model.TransactionHistory;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionHistory,Long> {
}
