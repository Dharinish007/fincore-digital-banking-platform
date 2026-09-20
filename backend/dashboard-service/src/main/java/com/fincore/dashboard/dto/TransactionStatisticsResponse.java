package com.fincore.dashboard.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionStatisticsResponse {

    private long totalTransactions;
    private long successfulTransactions;
    private long failedTransactions;

    private long deposits;
    private long withdrawals;
    private long transfers;

    private BigDecimal totalDepositAmount;
    private BigDecimal totalWithdrawalAmount;
    private BigDecimal totalTransferAmount;
}