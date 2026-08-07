package com.fincore.transaction.repository;

import com.fincore.transaction.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByAccountNumberOrderByCreatedAtDesc(String accountNumber, Pageable pageable);
}
