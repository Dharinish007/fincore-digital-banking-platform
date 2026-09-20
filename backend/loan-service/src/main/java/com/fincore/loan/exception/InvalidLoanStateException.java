package com.fincore.loan.exception;

public class InvalidLoanStateException extends RuntimeException {
    public InvalidLoanStateException(String message) {
        super(message);
    }
}
