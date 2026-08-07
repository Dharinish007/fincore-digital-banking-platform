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
public class AccountResponse {
    private String accountNumber;
    private Long customerId;
    private String customerName;
    private String email;
    private String mobile;
    private String branch;
    private String accountType;
    private BigDecimal initialDeposit;
    private String status;
    private String createdAt;
}
