package com.fincore.loan.exception;

public class LoanOwnershipViolationException extends RuntimeException {
    public LoanOwnershipViolationException(String message) {
        super(message);
    }
}
