package com.fincore;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication(scanBasePackages = {
        "com.fincore",
        "com.example.milestone3"
})
@EnableJpaRepositories(basePackages = {
        "com.fincore",
        "com.example.milestone3"
})
@EntityScan(basePackages = {
        "com.fincore",
        "com.example.milestone3"
})
public class FincoreBankingApplication {

    public static void main(String[] args) {
        SpringApplication.run(FincoreBankingApplication.class, args);
    }

    @Bean
    public CommandLineRunner databaseSequenceInit(JdbcTemplate jdbcTemplate) {
        return args -> {
            String[] tables = {
                "customer", "account", "transactions", "risk_assessment",
                "liveness_verification", "fraud_events", "notifications",
                "loans", "account_statement", "audit_log", "disbursements",
                "collections", "customer_security_credentials"
            };

            for (String table : tables) {
                try {
                    // Safe execution if on PostgreSQL; silently ignores if running on MySQL/H2
                    String sql = "SELECT setval(pg_get_serial_sequence('" + table + "', 'id'), COALESCE((SELECT MAX(id) FROM " + table + "), 0) + 1, false)";
                    jdbcTemplate.execute(sql);
                } catch (Exception ignored) {
                    // Non-PostgreSQL dialect or table not yet populated
                }
            }
        };
    }
}
