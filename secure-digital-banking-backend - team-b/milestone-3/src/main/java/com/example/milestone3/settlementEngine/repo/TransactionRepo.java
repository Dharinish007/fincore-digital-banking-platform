package com.example.milestone3.settlementEngine.repo;

import com.example.milestone3.settlementEngine.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface TransactionRepo extends JpaRepository<Transaction,Long> {
    @Query("""
        SELECT COUNT(t)
        FROM Transaction t
        WHERE t.loanId IN (
            SELECT l.id
            FROM Loan l
            WHERE l.customerId = :userId
        )
        AND t.createdAt >= :time
    """)
    long countRecentTransactions(
            @Param("userId") Long userId,
            @Param("time") LocalDateTime time
    );
}
