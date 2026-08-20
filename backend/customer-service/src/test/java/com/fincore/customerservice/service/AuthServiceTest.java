package com.fincore.customerservice.service;

import com.fincore.customerservice.dto.LoginRequest;
import com.fincore.customerservice.dto.LoginResponse;
import com.fincore.customerservice.entity.User;
import com.fincore.customerservice.enums.Role;
import com.fincore.customerservice.repository.UserRepository;
import com.fincore.customerservice.security.JwtTokenProvider;
import com.fincore.customerservice.service.impl.AuthServiceImpl;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    private JwtTokenProvider jwtTokenProvider;
    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        jwtTokenProvider = new JwtTokenProvider(
                "FinCoreDigitalBankingPlatformSecureJwtSecretKey2026WithSufficientBitsForHmacSha256",
                86400000L
        );
        authService = new AuthServiceImpl(userRepository, jwtTokenProvider, passwordEncoder);
    }

    @Test
    @DisplayName("Should successfully authenticate CUSTOMER and include customerId claim")
    void testCustomerLoginSuccess() {
        User customerUser = User.builder()
                .id(10L)
                .username("customer_user")
                .passwordHash(passwordEncoder.encode("secret123"))
                .fullName("John Doe")
                .email("john@example.com")
                .role(Role.CUSTOMER)
                .customerId(101L)
                .enabled(true)
                .build();

        when(userRepository.findByUsernameIgnoreCase("customer_user")).thenReturn(Optional.of(customerUser));

        LoginResponse response = authService.login(new LoginRequest("customer_user", "secret123"));

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("customer_user", response.getUser().getUsername());
        assertEquals(Role.CUSTOMER, response.getUser().getRole());
        assertEquals(101L, response.getUser().getCustomerId());
        assertNull(response.getUser().getEmployeeId());
        assertTrue(response.getUser().getPermissions().contains("LOAN_APPLY"));

        // Verify token claims
        assertTrue(jwtTokenProvider.validateToken(response.getToken()));
        Claims claims = jwtTokenProvider.getClaimsFromToken(response.getToken());
        assertEquals("customer_user", claims.getSubject());
        assertEquals("CUSTOMER", claims.get("role"));
        assertEquals(101, claims.get("customerId", Integer.class));
    }

    @Test
    @DisplayName("Should successfully authenticate EMPLOYEE and include employeeId claim")
    void testEmployeeLoginSuccess() {
        User employeeUser = User.builder()
                .id(20L)
                .username("officer_sarah")
                .passwordHash(passwordEncoder.encode("officer123"))
                .fullName("Sarah Jenkins")
                .email("sarah@fincore.bank")
                .role(Role.EMPLOYEE)
                .employeeId(501L)
                .enabled(true)
                .build();

        when(userRepository.findByUsernameIgnoreCase("officer_sarah")).thenReturn(Optional.of(employeeUser));

        LoginResponse response = authService.login(new LoginRequest("officer_sarah", "officer123"));

        assertNotNull(response);
        assertEquals(Role.EMPLOYEE, response.getUser().getRole());
        assertEquals(501L, response.getUser().getEmployeeId());
        assertNull(response.getUser().getCustomerId());
        assertTrue(response.getUser().getPermissions().contains("LOAN_APPROVE"));
    }

    @Test
    @DisplayName("Should successfully authenticate ADMIN without requiring customer/employee link")
    void testAdminLoginSuccess() {
        User adminUser = User.builder()
                .id(1L)
                .username("superadmin")
                .passwordHash(passwordEncoder.encode("adminpass"))
                .fullName("System Admin")
                .email("admin@fincore.bank")
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        when(userRepository.findByUsernameIgnoreCase("superadmin")).thenReturn(Optional.of(adminUser));

        LoginResponse response = authService.login(new LoginRequest("superadmin", "adminpass"));

        assertNotNull(response);
        assertEquals(Role.ADMIN, response.getUser().getRole());
        assertNull(response.getUser().getCustomerId());
        assertNull(response.getUser().getEmployeeId());
        assertTrue(response.getUser().getPermissions().contains("USER_MANAGE"));
    }

    @Test
    @DisplayName("Should reject login with invalid password")
    void testInvalidPassword() {
        User user = User.builder()
                .id(1L)
                .username("john")
                .passwordHash(passwordEncoder.encode("correctpass"))
                .enabled(true)
                .build();

        when(userRepository.findByUsernameIgnoreCase("john")).thenReturn(Optional.of(user));

        assertThrows(BadCredentialsException.class, () ->
                authService.login(new LoginRequest("john", "wrongpass")));
    }

    @Test
    @DisplayName("Should reject login for non-existent user")
    void testUserNotFound() {
        when(userRepository.findByUsernameIgnoreCase("unknown")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () ->
                authService.login(new LoginRequest("unknown", "any")));
    }
}
