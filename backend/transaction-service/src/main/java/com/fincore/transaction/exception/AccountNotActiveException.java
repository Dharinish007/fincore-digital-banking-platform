package com.fincore.transaction.exception;

public class AccountNotActiveException extends RuntimeException {
    public AccountNotActiveException(String accountNumber, String status) {
        super("Account " + accountNumber + " is not active (status=" + status + ")");
    }
}
