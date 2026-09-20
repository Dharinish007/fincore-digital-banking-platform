package com.fincore.BankingManagement.Milestone1.account.BankingServices.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fincore.BankingManagement.Milestone1.account.BankingServices.Enums.AccountStatus;
import com.fincore.BankingManagement.Milestone1.account.BankingServices.Enums.AccountType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {

    private Long customerId;

    private String accountNo;

    private AccountType accountType;

    private BigDecimal balance;

    private String branchName;

    private LocalDateTime createdAt;

    private String ifscCode;

    private AccountStatus status;
}