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
    private Integer accountId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private userEntity customerId;

    @Column(name = "account_number", length = 20)
    private String accountNumber;

    @Column(name = "account_type", length = 30)
    private String accountType;

    @Column(precision = 12, scale = 2)
    private BigDecimal balance;

    @Column(name = "available_balance", precision = 12, scale = 2)
    private BigDecimal availableBalance;

    @Column(length = 20)
    private String status;

    @Column(name = "created_date")
    private LocalDateTime openingDate;

    @OneToMany(mappedBy = "senderAccountNumber", cascade = CascadeType.ALL)
    private List<transactionEntity> transactions;


}
