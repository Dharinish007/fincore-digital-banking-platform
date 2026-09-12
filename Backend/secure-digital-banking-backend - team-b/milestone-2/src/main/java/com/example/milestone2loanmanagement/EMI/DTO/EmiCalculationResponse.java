package com.example.milestone2loanmanagement.EMI.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmiCalculationResponse {
    private BigDecimal emiAmount;
    private BigDecimal totalAmount;
    private BigDecimal totalInterest;
}
