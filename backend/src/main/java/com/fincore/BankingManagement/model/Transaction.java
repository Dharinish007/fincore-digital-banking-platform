package com.fincore.BankingManagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @Column(name = "transaction_code", unique = true, length = 30)
    private String transactionCode;

    @Column(name = "sender_account_no", length = 30)
    private String senderAccountNo;

    @Column(name = "sender_name")
    private String senderName;

    @Column(name = "receiver_account_no", length = 30)
    private String receiverAccountNo;

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "transaction_type", nullable = false, length = 20)
    private String transactionType;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "charges", precision = 15, scale = 2)
    private BigDecimal charges = BigDecimal.ZERO;

    @Column(name = "reference", length = 50)
    private String reference;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "transaction_date", updatable = false)
    private LocalDateTime transactionDate;

    @PrePersist
    public void prePersist() {
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
    }
}
