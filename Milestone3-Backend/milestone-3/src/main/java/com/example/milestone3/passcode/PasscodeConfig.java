package com.example.milestone3.passcode;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasscodeConfig {
    @Bean
    PasswordEncoder passcodeEncoder() {
        return new BCryptPasswordEncoder();
    }
}
