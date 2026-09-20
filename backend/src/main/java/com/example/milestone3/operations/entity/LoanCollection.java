package com.example.milestone3.operations.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class LoanCollection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long loanId;
    private Long scheduleId;
    private BigDecimal amount;
    private String channel;
    private String reference;
    private String status = "RECEIVED";
    private LocalDateTime collectedAt = LocalDateTime.now();
}
