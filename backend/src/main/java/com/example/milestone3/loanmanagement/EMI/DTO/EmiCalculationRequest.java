package com.example.milestone3.loanmanagement.EMI.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmiCalculationRequest {
    private BigDecimal principalAmount;
    private BigDecimal interestRate;
    private Integer months;
    private Integer tenureMonths;
    private Long loanId;

    public EmiCalculationRequest(BigDecimal principalAmount, BigDecimal interestRate, Integer months) {
        this.principalAmount = principalAmount;
        this.interestRate = interestRate;
        this.months = months;
        this.tenureMonths = months;
    }

    public Integer getMonths() {
        if (months != null) return months;
        return tenureMonths;
    }

    public Integer getTenureMonths() {
        if (tenureMonths != null) return tenureMonths;
        return months;
    }
}
