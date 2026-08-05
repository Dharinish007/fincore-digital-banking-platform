package com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.entity;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.accountEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_detail")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class transactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;
    @ManyToOne
    @JoinColumn(name = "account_id")
    private accountEntity senderAccountNumber;
    @Column(name = "amount")
    private BigDecimal amount;
    @Column(name = "transaction_type")
    private String transactionType;
    @Column(name = "transaction_status")
    private String status;
    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;
    @Column(name = "description")
    private String remarks;


}
