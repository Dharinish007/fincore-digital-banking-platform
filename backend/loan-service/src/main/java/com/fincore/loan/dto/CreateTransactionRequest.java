package com.fincore.loan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTransactionRequest {
    private String sourceAccountId;
    private String destinationAccountId;
    private String type;
    private BigDecimal amount;
    private String currency;
    private String description;
    private String referenceNumber;
}
