package com.bankingapp.accountservice.dto;

import com.bankingapp.accountservice.enums.AccountType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class AccountCreateRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @PositiveOrZero(message = "Initial balance cannot be negative")
    private BigDecimal initialBalance;

    public AccountCreateRequest() {
    }

    public AccountCreateRequest(Long customerId, AccountType accountType, BigDecimal initialBalance) {
        this.customerId = customerId;
        this.accountType = accountType;
        this.initialBalance = initialBalance;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getInitialBalance() {
        return initialBalance;
    }

    public void setInitialBalance(BigDecimal initialBalance) {
        this.initialBalance = initialBalance;
    }
}
