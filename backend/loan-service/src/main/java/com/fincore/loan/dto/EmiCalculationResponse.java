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
public class EmiCalculationResponse {
    private BigDecimal principalAmount;
    private BigDecimal annualInterestRate;
    private Integer tenureMonths;
    private BigDecimal monthlyEmi;
    private BigDecimal totalInterest;
    private BigDecimal totalRepaymentAmount;
    private List<RepaymentScheduleItem> amortizationSchedule;
}
