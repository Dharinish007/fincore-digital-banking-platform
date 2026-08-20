package com.bankingapp.accountservice.exception;

public class AccountOwnershipViolationException extends RuntimeException {
    public AccountOwnershipViolationException(String message) {
        super(message);
    }
}
