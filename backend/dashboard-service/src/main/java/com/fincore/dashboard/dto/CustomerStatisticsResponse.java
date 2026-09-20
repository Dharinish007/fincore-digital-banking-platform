package com.fincore.dashboard.dto;

import lombok.Data;

@Data
public class CustomerStatisticsResponse {

    private long totalCustomers;
    private long activeCustomers;
    private long inactiveCustomers;
    private long pendingKyc;
    private long verifiedKyc;
    private long rejectedKyc;
}