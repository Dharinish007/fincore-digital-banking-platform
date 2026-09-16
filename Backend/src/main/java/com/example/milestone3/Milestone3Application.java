package com.example.milestone3;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class Milestone3Application {

    public static void main(String[] args) {
        SpringApplication.run(Milestone3Application.class, args);
    }

    @Bean
    public CommandLineRunner syncDatabaseSequences(JdbcTemplate jdbcTemplate) {
        return args -> {
            String[] tables = {
                "customer", "account", "transaction", "risk_assessment",
                "liveness_verification", "fraud_event", "notifications",
                "loan", "account_statement", "audit_log", "loan_disbursement",
                "loan_collection", "customer_security_credential"
            };

            for (String table : tables) {
                try {
                    String sql = "SELECT setval(pg_get_serial_sequence('" + table + "', 'id'), COALESCE((SELECT MAX(id) FROM " + table + "), 0) + 1, false)";
                    jdbcTemplate.execute(sql);
                } catch (Exception e) {
                    // Ignore if sequence or table doesn't exist
                }
            }
        };
    }
}
