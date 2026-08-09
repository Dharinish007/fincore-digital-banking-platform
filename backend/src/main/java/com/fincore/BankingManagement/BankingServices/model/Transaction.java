package com.fincore.BankingManagement.BankingServices.model;
import com.fincore.BankingManagement.BankingServices.Enums.TransactionType;
import com.fincore.BankingManagement.Entities.Account;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_no")
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "transaction_date", updatable = false)
    private LocalDate transactionDate;

    @PrePersist
    public void prePersist() {
        transactionDate = LocalDate.now();
    }



    // Getters and Setters
}