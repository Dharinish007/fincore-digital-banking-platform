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
public class LoanStatisticsResponse {
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long totalLoans;
    private long activeLoans;
    private long pendingDisbursementLoans;
    private BigDecimal totalDisbursedAmount;
    private BigDecimal totalActiveOutstandingAmount;
}
