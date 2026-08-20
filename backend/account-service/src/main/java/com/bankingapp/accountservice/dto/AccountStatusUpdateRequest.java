package com.bankingapp.accountservice.dto;

import com.bankingapp.accountservice.enums.AccountStatus;
import jakarta.validation.constraints.NotNull;

public class AccountStatusUpdateRequest {

    @NotNull(message = "Account status is required")
    private AccountStatus status;

    public AccountStatusUpdateRequest() {
    }

    public AccountStatusUpdateRequest(AccountStatus status) {
        this.status = status;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }
}
