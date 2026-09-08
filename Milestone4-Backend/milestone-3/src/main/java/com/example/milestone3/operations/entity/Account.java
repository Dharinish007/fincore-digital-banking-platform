package com.example.milestone3.operations.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String accountNumber;
    private Long customerId;
    private String accountType;
    private BigDecimal balance = BigDecimal.ZERO;
    private String status = "ACTIVE";
    private LocalDate openedAt = LocalDate.now();
    private LocalDate closedAt;
}
