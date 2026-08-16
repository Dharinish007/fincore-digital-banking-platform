package com.bankingapp.originationservice.exception;

public class WorkflowConflictException extends RuntimeException {

    public WorkflowConflictException(String message) {
        super(message);
    }
}