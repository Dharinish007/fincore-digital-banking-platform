package com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.entity;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.accountEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_details")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class transactionEntity {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Integer transactionId;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private accountEntity senderAccountNumber;

    @Column(name = "amount", precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "transaction_type", length = 20)
    private String transactionType;

    @Column(name = "transaction_status", length = 20)
    private String status;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @Column(name = "description", length = 200)
    private String remarks;



}
