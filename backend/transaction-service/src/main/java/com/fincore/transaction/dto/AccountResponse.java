package com.fincore.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {

    private Long accountId;
    private Long customerId;
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String status;
    private LocalDateTime createdAt;
}