package com.example.milestone2loanmanagement.EMI.DTO;

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
}
