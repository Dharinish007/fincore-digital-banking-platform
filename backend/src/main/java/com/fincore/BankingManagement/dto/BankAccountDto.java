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
public class BankAccountDto {
    private String id;
    private String accountNumber;
    private String customerName;
    private String customerId;
    private String branch;
    private String accountType;
    private BigDecimal ledgerBalance;
    private BigDecimal availableBalance;
    private BigDecimal systemCalculatedBalance;
    private BigDecimal difference;
    private String status;
    private String lastVerified;
}
