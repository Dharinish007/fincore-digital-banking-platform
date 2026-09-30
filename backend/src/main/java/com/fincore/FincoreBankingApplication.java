package com.fincore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * FinCore Digital Banking Platform
 * Secure Digital Banking Platform with Transaction Management System
 */
@SpringBootApplication
@EnableTransactionManagement
@EnableScheduling
public class FincoreBankingApplication {

    public static void main(String[] args) {
        SpringApplication.run(FincoreBankingApplication.class, args);
    }
}
