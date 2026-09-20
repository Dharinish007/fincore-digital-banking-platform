package com.fincore.customerservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatisticsResponse {

    private long totalCustomers;
    private long activeCustomers;
    private long inactiveCustomers;
    private long pendingKyc;
    private long verifiedKyc;
    private long rejectedKyc;
}