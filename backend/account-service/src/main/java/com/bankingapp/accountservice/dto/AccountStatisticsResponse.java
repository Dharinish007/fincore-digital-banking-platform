package com.bankingapp.accountservice.dto;

import java.math.BigDecimal;

public class AccountStatisticsResponse {

    private long totalAccounts;
    private long activeAccounts;
    private long inactiveAccounts;
    private long blockedAccounts;
    private long closedAccounts;
    private long savingsAccounts;
    private long currentAccounts;
    private BigDecimal totalBalance;

    public AccountStatisticsResponse() {
    }

    public AccountStatisticsResponse(
            long totalAccounts,
            long activeAccounts,
            long inactiveAccounts,
            long blockedAccounts,
            long closedAccounts,
            long savingsAccounts,
            long currentAccounts,
            BigDecimal totalBalance) {

        this.totalAccounts = totalAccounts;
        this.activeAccounts = activeAccounts;
        this.inactiveAccounts = inactiveAccounts;
        this.blockedAccounts = blockedAccounts;
        this.closedAccounts = closedAccounts;
        this.savingsAccounts = savingsAccounts;
        this.currentAccounts = currentAccounts;
        this.totalBalance = totalBalance;
    }

    public long getTotalAccounts() {
        return totalAccounts;
    }

    public long getActiveAccounts() {
        return activeAccounts;
    }

    public long getInactiveAccounts() {
        return inactiveAccounts;
    }

    public long getBlockedAccounts() {
        return blockedAccounts;
    }

    public long getClosedAccounts() {
        return closedAccounts;
    }

    public long getSavingsAccounts() {
        return savingsAccounts;
    }

    public long getCurrentAccounts() {
        return currentAccounts;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }
}