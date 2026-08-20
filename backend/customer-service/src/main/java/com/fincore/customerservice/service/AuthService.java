package com.fincore.customerservice.service;

import com.fincore.customerservice.dto.LoginRequest;
import com.fincore.customerservice.dto.LoginResponse;
import com.fincore.customerservice.dto.UserResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    UserResponse getCurrentUser(String username);
}
