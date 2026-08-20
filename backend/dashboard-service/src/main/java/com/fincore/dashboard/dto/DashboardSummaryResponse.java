package com.fincore.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private CustomerStatisticsResponse customers;
    private AccountStatisticsResponse accounts;
    private TransactionStatisticsResponse transactions;
}