package com.fincore.loan.exception;

import lombok.Getter;

@Getter
public class IntegrationException extends RuntimeException {

    private final String serviceName;
    private final int statusCode;

    public IntegrationException(String serviceName, int statusCode, String message) {
        super(String.format("[%s Error %d] %s", serviceName, statusCode, message));
        this.serviceName = serviceName;
        this.statusCode = statusCode;
    }

    public IntegrationException(String serviceName, String message) {
        super(String.format("[%s Error] %s", serviceName, message));
        this.serviceName = serviceName;
        this.statusCode = 500;
    }
}
