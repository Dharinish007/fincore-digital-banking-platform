package com.bankingapp.accountservice.exception;

public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException(String accountNumber) {
        super("Insufficient balance for account: " + accountNumber);
    }
}