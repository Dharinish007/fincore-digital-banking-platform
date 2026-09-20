package com.example.milestone3.loanmanagement.EMI.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmiCalculationResponse {
    private BigDecimal emiAmount;
    private BigDecimal monthlyEmi;
    private BigDecimal totalAmount;
    private BigDecimal totalPayable;
    private BigDecimal totalInterest;
    private BigDecimal principalAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private Long loanId;
    private Long emiId;
    private LocalDateTime calculatedAt = LocalDateTime.now();

    public BigDecimal getMonthlyEmi() {
        return monthlyEmi != null ? monthlyEmi : emiAmount;
    }

    public BigDecimal getTotalPayable() {
        return totalPayable != null ? totalPayable : totalAmount;
    }
}
