package com.fincore.kyc_service.service;

public interface OtpService {

    void sendOtp(String email);

    boolean verifyOtp(String email, String otp);

}