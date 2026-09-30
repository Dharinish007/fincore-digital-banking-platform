package com.fincore.controller;

import com.fincore.dto.ApiResponse;
import com.fincore.dto.AuthRequest;
import com.fincore.dto.AuthResponse;
import com.fincore.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.authenticateUser(request);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Object>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved", authService.getAllUsers()));
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<ApiResponse<Object>> blockUser(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "admin") String performedBy,
            @RequestParam(required = false, defaultValue = "Admin block") String reason) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("User blocked successfully", authService.blockUser(id, performedBy, reason)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<ApiResponse<Object>> unblockUser(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "admin") String performedBy) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("User unblocked successfully", authService.unblockUser(id, performedBy)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<Object>> updateRole(
            @PathVariable String id,
            @RequestParam com.fincore.entity.User.Role role,
            @RequestParam(required = false, defaultValue = "admin") String performedBy) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Role updated successfully", authService.updateUserRole(id, role, performedBy)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
