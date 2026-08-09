package com.fincore.BankingManagement.Entities;
import com.fincore.BankingManagement.BankingServices.Enums.AccountStatus;
import com.fincore.BankingManagement.BankingServices.Enums.AccountType;
import com.fincore.BankingManagement.BankingServices.model.Customer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @Column(name = "account_no")
    private String accountNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    @Column(name = "balance", precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AccountStatus status = AccountStatus.Active;

    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDate.now();
    }

}
