package com.fincore.loan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {
    private Long id;
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
