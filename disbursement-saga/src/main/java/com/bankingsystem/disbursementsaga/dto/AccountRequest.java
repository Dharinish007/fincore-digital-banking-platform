package com.bankingsystem.disbursementsaga.dto;

import com.bankingsystem.disbursementsaga.enums.AccountStatus;
import com.bankingsystem.disbursementsaga.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class AccountRequest {

    private Long customerId;
    private String accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private AccountStatus status;
}
