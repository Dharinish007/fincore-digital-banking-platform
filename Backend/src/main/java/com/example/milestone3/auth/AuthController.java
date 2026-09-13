package com.example.milestone3.auth;

import com.example.milestone3.audit.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuditLogService auditLogService;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
        private String username;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest request) {
        String identifier = req.getEmail() != null ? req.getEmail() : (req.getUsername() != null ? req.getUsername() : "admin");
        String ip = request != null ? request.getRemoteAddr() : "127.0.0.1";
        
        auditLogService.record(null, identifier, "AUTH_LOGIN_SUCCESS", "AUTH", "USER_SESSION", identifier, "User authenticated into banking portal", "SUCCESS", ip);

        return ResponseEntity.ok(Map.of(
                "token", "fincore-jwt-token-" + System.currentTimeMillis(),
                "user", Map.of(
                        "username", identifier,
                        "name", "Administrator",
                        "role", "ADMIN"
                ),
                "message", "Authenticated successfully"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req, HttpServletRequest request) {
        String email = req.getEmail() != null ? req.getEmail() : "new_user";
        String ip = request != null ? request.getRemoteAddr() : "127.0.0.1";

        auditLogService.record(null, email, "AUTH_USER_REGISTERED", "AUTH", "USER", email, "New user account created: " + req.getName(), "SUCCESS", ip);

        return ResponseEntity.ok(Map.of(
                "message", "Registration successful. Please proceed to login.",
                "email", email
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        auditLogService.record(null, "USER", "AUTH_LOGOUT", "AUTH", "USER_SESSION", "N/A", "User logged out of active session", "SUCCESS", null);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
