package com.fincore.kyc_service.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class OtpServiceImpl implements OtpService {

    private Map<String, String> otpStorage = new HashMap<>();

    @Override
    public void sendOtp(String email) {

        Random random = new Random();

        int otp = 100000 + random.nextInt(900000);

        String otpValue = String.valueOf(otp);

        otpStorage.put(email, otpValue);

        System.out.println("OTP for " + email + " is: " + otpValue);

    }

    @Override
    public boolean verifyOtp(String email, String otp) {

        String storedOtp = otpStorage.get(email);

        if (storedOtp == null) {
            return false;
        }

        if (storedOtp.equals(otp)) {

            otpStorage.remove(email);

            return true;
        }

        return false;
    }

}