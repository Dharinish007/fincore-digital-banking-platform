package com.fincore.BankingManagement.models;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name ="account")
@Data
public class Account {
    @Id
    @Column(name = "account_no")
    private String accountNo;
    @Column(name = "customer_id", nullable = false)
    private Long customerId;
    @Column(name = "account_type", nullable = false)
    private String accountType;
    @Column(name = "balance", nullable = false)
    private BigDecimal balance;
    @Column(name = "branch_name")
    private String branchName;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "ifsc_code")
    private String ifscCode;
    @Column(name = "status")
    private String status;
}
