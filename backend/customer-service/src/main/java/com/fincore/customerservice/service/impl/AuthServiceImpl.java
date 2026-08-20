package com.fincore.customerservice.service.impl;

import com.fincore.customerservice.dto.LoginRequest;
import com.fincore.customerservice.dto.LoginResponse;
import com.fincore.customerservice.dto.UserResponse;
import com.fincore.customerservice.entity.User;
import com.fincore.customerservice.exception.ResourceNotFoundException;
import com.fincore.customerservice.repository.UserRepository;
import com.fincore.customerservice.security.JwtTokenProvider;
import com.fincore.customerservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String username = request.getUsername().trim();
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        if (!user.isEnabled()) {
            throw new BadCredentialsException("Account is disabled. Please contact support.");
        }

        String token = jwtTokenProvider.generateToken(user);
        log.info("User '{}' authenticated successfully with role={}", user.getUsername(), user.getRole());

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationMs())
                .user(UserResponse.from(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return UserResponse.from(user);
    }
}
