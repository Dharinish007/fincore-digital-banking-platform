package com.fincore.repository;

import com.fincore.entity.Transaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    Optional<Transaction> findByTransactionReference(String transactionReference);
    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);
    List<Transaction> findByAccountIdOrderByCreatedAtDesc(String accountId);
    List<Transaction> findByAccountNumberOrderByCreatedAtDesc(String accountNumber);
    List<Transaction> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Transaction> findAllByOrderByCreatedAtDesc();
}
