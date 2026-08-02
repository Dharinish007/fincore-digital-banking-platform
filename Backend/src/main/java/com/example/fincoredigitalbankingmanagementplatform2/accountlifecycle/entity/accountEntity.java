package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity;

import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.entity.transactionEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "account")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class accountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private userEntity customerId;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "account_type")
    private String accountType;

    private BigDecimal balance;

    @Column(name = "available_balance")
    private BigDecimal availableBalance;

    private String status;

    @Column(name = "created_date")
    private LocalDateTime openingDate;

    @OneToMany(mappedBy = "senderAccountNumber", cascade = CascadeType.ALL)
    private List<transactionEntity> transactions;


}
