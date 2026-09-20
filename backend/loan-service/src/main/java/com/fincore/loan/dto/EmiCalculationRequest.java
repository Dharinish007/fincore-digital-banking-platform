package com.fincore.loan.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmiCalculationRequest {

    @NotNull(message = "Principal amount is required")
    @DecimalMin(value = "100.00", message = "Principal amount must be at least 100.00")
    private BigDecimal principalAmount;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.00", message = "Interest rate cannot be negative")
    @DecimalMax(value = "100.00", message = "Interest rate cannot exceed 100%")
    private BigDecimal annualInterestRate;

    @NotNull(message = "Tenure in months is required")
    @Min(value = 1, message = "Tenure must be at least 1 month")
    private Integer tenureMonths;
}
