package com.fincore.BankingManagement.repository;

import com.fincore.BankingManagement.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionCode(String transactionCode);
    Optional<Transaction> findByReference(String reference);
    List<Transaction> findBySenderAccountNoOrReceiverAccountNoOrderByTransactionDateDesc(String sender, String receiver);
}
