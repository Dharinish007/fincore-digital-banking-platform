package com.fincore.BankingManagement.model;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class TransactionHistory{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @ManyToOne
    @JoinColumn(name = "sender_account_id")
    private Account senderAccount;

    @ManyToOne
    @JoinColumn(name = "receiver_account_id")
    private Account receiverAccount;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String transactionType;

    @Column(nullable = false)
    private String status;

    private LocalDateTime transactionDate;
}