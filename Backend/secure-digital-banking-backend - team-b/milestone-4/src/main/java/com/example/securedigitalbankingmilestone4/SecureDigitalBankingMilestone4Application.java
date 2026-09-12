package com.example.securedigitalbankingmilestone4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class SecureDigitalBankingMilestone4Application {

    public static void main(String[] args) {
        SpringApplication.run(SecureDigitalBankingMilestone4Application.class, args);
    }

}
