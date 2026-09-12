package com.example.milestone3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class Milestone3Application {

    public static void main(String[] args) {
        SpringApplication.run(Milestone3Application.class, args);
    }

}
