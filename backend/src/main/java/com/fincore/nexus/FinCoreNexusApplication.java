package com.fincore.nexus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * FinCore Nexus Enterprise Digital Banking Platform
 * Root Application Bootstrapper
 * Supporting Milestones 1, 2, 3, 4
 */
@SpringBootApplication
@EnableScheduling
public class FinCoreNexusApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinCoreNexusApplication.class, args);
    }
}
