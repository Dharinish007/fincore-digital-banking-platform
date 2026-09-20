package com.fincore.loan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepaymentScheduleResponse {
    private String loanNumber;
    private BigDecimal principalAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private BigDecimal monthlyEmi;
    private BigDecimal totalInterest;
    private BigDecimal totalRepaymentAmount;
    private List<RepaymentScheduleItem> schedule;
}
