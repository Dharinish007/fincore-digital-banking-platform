package com.fincore.dashboard.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {

    private String referenceId;
    private String accountNumber;
    private String counterpartyAccountNumber;
    private String type;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;
}