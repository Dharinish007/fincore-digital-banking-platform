package com.fincore.BankingManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferResponse {
    private String id;
    private String status;
    private BigDecimal amount;
    private BigDecimal senderBalance;
    private String date;
    private String reference;
    private String failureReason;
}
