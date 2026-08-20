package com.fincore.dashboard.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountStatisticsResponse {

    private long totalAccounts;
    private long activeAccounts;
    private long inactiveAccounts;
    private long blockedAccounts;
    private long closedAccounts;
    private long savingsAccounts;
    private long currentAccounts;
    private BigDecimal totalBalance;
}