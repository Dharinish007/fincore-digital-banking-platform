package com.bankingsystem.disbursementsaga.dto;

import com.bankingsystem.disbursementsaga.enums.AccountStatus;
import com.bankingsystem.disbursementsaga.enums.AccountType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class AccountResponse {

    private Long accountId;
    private Long customerId;
    private String accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private AccountStatus status;
    private LocalDateTime createdAt;
}
