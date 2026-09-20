package com.fincore.customerservice.controller;

import com.fincore.customerservice.dto.ApiResponse;
import com.fincore.customerservice.dto.LoginRequest;
import com.fincore.customerservice.dto.LoginResponse;
import com.fincore.customerservice.dto.UserResponse;
import com.fincore.customerservice.security.JwtTokenProvider;
import com.fincore.customerservice.service.AuthService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(ApiResponse.error("Missing or invalid Authorization header"));
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid or expired token"));
        }

        Claims claims = jwtTokenProvider.getClaimsFromToken(token);
        String username = claims.getSubject();
        UserResponse response = authService.getCurrentUser(username);

        return ResponseEntity.ok(ApiResponse.success(response, "User profile retrieved successfully"));
    }
}
