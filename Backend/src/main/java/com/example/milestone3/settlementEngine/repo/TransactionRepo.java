package com.example.milestone3.settlementEngine.repo;

import com.example.milestone3.settlementEngine.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepo extends JpaRepository<Transaction,Long> {
    List<Transaction> findTop5ByOrderByCreatedAtDescIdDesc();

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

    /**
     * Retrieves the full transaction history for a customer (transactions
     * belonging to any loan owned by the customer). Used by the Risk
     * Assessment module to give the AI model additional transaction context.
     */
    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.loanId IN (
            SELECT l.id
            FROM Loan l
            WHERE l.customerId = :userId
        )
        ORDER BY t.createdAt DESC, t.id DESC
    """)
    List<Transaction> findTransactionsByCustomerId(@Param("userId") Long userId);
}
