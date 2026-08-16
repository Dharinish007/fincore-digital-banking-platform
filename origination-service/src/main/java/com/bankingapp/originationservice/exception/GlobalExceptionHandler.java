package com.bankingapp.originationservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleResourceNotFound(
            ResourceNotFoundException ex) {

        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 404,
                "error", "Not Found",
                "message", ex.getMessage()
        );
    }

    @ExceptionHandler(WorkflowConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, Object> handleWorkflowConflict(
            WorkflowConflictException ex) {

        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 409,
                "error", "Conflict",
                "message", ex.getMessage()
        );
    }

    @ExceptionHandler(ServiceIntegrationException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Map<String, Object> handleServiceIntegration(
            ServiceIntegrationException ex) {

        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 503,
                "error", "Service Unavailable",
                "message", ex.getMessage()
        );
    }
}