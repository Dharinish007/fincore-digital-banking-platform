package com.bankingapp.accountservice.dto;

import com.bankingapp.accountservice.enums.AccountType;
import jakarta.validation.constraints.NotNull;

public class AccountUpdateRequest {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    public AccountUpdateRequest() {
    }

    public AccountUpdateRequest(AccountType accountType) {
        this.accountType = accountType;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
}
