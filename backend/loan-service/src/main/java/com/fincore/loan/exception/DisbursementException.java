package com.fincore.loan.exception;

public class DisbursementException extends RuntimeException {
    public DisbursementException(String message) {
        super(message);
    }

    public DisbursementException(String message, Throwable cause) {
        super(message, cause);
    }
}
