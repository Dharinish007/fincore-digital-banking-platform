package com.example.milestone3.auth;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.operations.entity.Customer;
import com.example.milestone3.operations.repo.CustomerRepo;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private CustomerRepo customerRepo;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
        private String username;
        private String role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String role;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest request) {
        String identifier = req.getEmail() != null && !req.getEmail().isBlank()
                ? req.getEmail().trim()
                : (req.getUsername() != null && !req.getUsername().isBlank() ? req.getUsername().trim() : "admin");
        
        String ip = request != null ? request.getRemoteAddr() : "127.0.0.1";
        String lowerId = identifier.toLowerCase();

        String determinedRole = "ADMIN";
        String displayName = "System Administrator";
        Long customerId = null;
        String accountNumber = null;

        if (lowerId.contains("admin") || "admin1".equals(lowerId) || "admin2".equals(lowerId)) {
            determinedRole = "ADMIN";
            displayName = "admin1".equals(lowerId) ? "Alex Vance" : "Sarah Connor";
        } else if (lowerId.contains("staff") || "teller".equals(lowerId)) {
            determinedRole = "BANK_STAFF";
            displayName = "Pooja Verma (Branch Staff)";
        } else if (lowerId.contains("loan") || "underwriter".equals(lowerId)) {
            determinedRole = "LOAN_OFFICER";
            displayName = "David Miller (Loan Officer)";
        } else if (lowerId.contains("fraud") || "aml".equals(lowerId) || "security".equals(lowerId)) {
            determinedRole = "FRAUD_OFFICER";
            displayName = "Elena Rostova (Fraud Analyst)";
        } else if (lowerId.contains("audit") || "compliance".equals(lowerId) || "inspector".equals(lowerId)) {
            determinedRole = "AUDITOR";
            displayName = "Marcus Thorne (Lead Auditor)";
        } else if (lowerId.contains("customer") || lowerId.contains("john") || lowerId.contains("sarah") || lowerId.contains("techcorp")) {
            determinedRole = "CUSTOMER";
            if (lowerId.contains("sarah")) {
                customerId = 2L;
                displayName = "Sarah Jenkins";
                accountNumber = "ACC-8849-1002";
            } else if (lowerId.contains("techcorp")) {
                customerId = 3L;
                displayName = "TechCorp Industries";
                accountNumber = "ACC-8849-1003";
            } else {
                customerId = 1L;
                displayName = "John Smith";
                accountNumber = "ACC-8849-1001";
            }
        } else {
            // Check if user matches a customer email in the database
            Optional<Customer> opt = customerRepo.findAll().stream()
                    .filter(c -> c.getEmail() != null && c.getEmail().equalsIgnoreCase(identifier))
                    .findFirst();
            if (opt.isPresent()) {
                Customer c = opt.get();
                determinedRole = "CUSTOMER";
                customerId = c.getId();
                displayName = c.getFullName();
                accountNumber = c.getAccountNumber();
            } else if (req.getRole() != null && !req.getRole().isBlank()) {
                determinedRole = req.getRole().trim().toUpperCase();
                displayName = identifier;
            }
        }

        // Record audit
        auditLogService.record(
                customerId,
                identifier,
                "AUTH_LOGIN_SUCCESS",
                "AUTH",
                "USER_SESSION",
                identifier,
                String.format("User authenticated into banking portal as role %s (%s)", determinedRole, displayName),
                "SUCCESS",
                ip
        );

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", identifier);
        userMap.put("name", displayName);
        userMap.put("role", determinedRole);
        userMap.put("email", identifier.contains("@") ? identifier : identifier + "@fincore.com");
        if (customerId != null) {
            userMap.put("customerId", customerId);
            userMap.put("accountNumber", accountNumber);
        }

        return ResponseEntity.ok(Map.of(
                "token", "fincore-jwt-token-" + System.currentTimeMillis(),
                "user", userMap,
                "role", determinedRole,
                "message", "Authenticated successfully"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req, HttpServletRequest request) {
        String email = req.getEmail() != null ? req.getEmail().trim() : "new_user@fincore.com";
        String ip = request != null ? request.getRemoteAddr() : "127.0.0.1";
        String role = req.getRole() != null && !req.getRole().isBlank() ? req.getRole().trim().toUpperCase() : "CUSTOMER";

        auditLogService.record(
                null,
                email,
                "AUTH_USER_REGISTERED",
                "AUTH",
                "USER",
                email,
                String.format("New %s account registered: %s (%s)", role, req.getName(), email),
                "SUCCESS",
                ip
        );

        return ResponseEntity.ok(Map.of(
                "message", "Registration successful. Please proceed to login.",
                "email", email,
                "role", role
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String ip = request != null ? request.getRemoteAddr() : "127.0.0.1";
        String userRole = request != null ? request.getHeader("X-User-Role") : "USER";
        auditLogService.record(null, "USER", "AUTH_LOGOUT", "AUTH", "USER_SESSION", "N/A", "User logged out of active session (" + userRole + ")", "SUCCESS", ip);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
