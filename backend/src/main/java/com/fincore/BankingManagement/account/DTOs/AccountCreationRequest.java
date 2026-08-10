package com.fincore.BankingManagement.account.DTOs;

import com.fincore.BankingManagement.BankingServices.Enums.AccountStatus;
import com.fincore.BankingManagement.BankingServices.Enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountCreationRequest {

    private String customerName;
    private String email;
    private String phone;

    private String accountNo;
    private AccountType accountType;
    private BigDecimal balance;
    private AccountStatus status;
    private String branchName;
    private String ifscCode;
}