package com.fincore.transaction.exception;

public class TransactionOwnershipViolationException extends RuntimeException {
    public TransactionOwnershipViolationException(String message) {
        super(message);
    }
}
