package com.example.milestone2loanmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class Milestone2LoanManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(Milestone2LoanManagementApplication.class, args);
    }

}
