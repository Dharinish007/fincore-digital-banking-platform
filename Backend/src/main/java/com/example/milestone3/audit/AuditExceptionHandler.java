package com.example.milestone3.audit;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
@RequiredArgsConstructor
public class AuditExceptionHandler {
    private final AuditLogService auditLogService;

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handle(Exception exception, HttpServletRequest request) {
        int status = exception instanceof IllegalArgumentException ? 400 : 500;
        String path = request.getRequestURI();
        auditLogService.record(null, "SYSTEM", "OPERATION_FAILED", moduleFor(path), "REQUEST", null,
                exception.getMessage() == null ? exception.getClass().getSimpleName() : exception.getMessage(),
                "FAILED", request.getRemoteAddr());
        return ResponseEntity.status(status).body(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", status,
                "error", status == 400 ? "Bad Request" : "Internal Server Error",
                "message", exception.getMessage() == null ? "Operation failed" : exception.getMessage(),
                "path", path));
    }

    private String moduleFor(String path) {
        if (path.startsWith("/api/liveness") || path.startsWith("/api/passcode")) return "SECURITY";
        if (path.startsWith("/api/risk") || path.startsWith("/api/fraud")) return "RISK";
        if (path.startsWith("/api/operations")) return "OPERATIONS";
        return "SYSTEM";
    }
}
