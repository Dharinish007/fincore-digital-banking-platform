package com.fincore.transaction.repository;

import com.fincore.transaction.entity.Transaction;
import com.fincore.transaction.entity.TransactionStatus;
import com.fincore.transaction.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    Page<Transaction> findByAccountNumberOrderByCreatedAtDesc(
            String accountNumber,
            Pageable pageable
    );

    Page<Transaction> findByAccountNumberInOrderByCreatedAtDesc(
            Collection<String> accountNumbers,
            Pageable pageable
    );

    Optional<Transaction> findByReferenceId(String referenceId);

    long countByStatus(TransactionStatus status);

    long countByType(TransactionType type);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.type = :type
            """)
    BigDecimal sumAmountByType(TransactionType type);

    Page<Transaction> findAllByOrderByCreatedAtDesc(Pageable pageable);
}