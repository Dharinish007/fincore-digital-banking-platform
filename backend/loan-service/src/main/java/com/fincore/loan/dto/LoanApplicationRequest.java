package com.fincore.loan.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplicationRequest {

    // Optional: Authoritatively derived from JWT authentication for CUSTOMER role; required for EMPLOYEE/ADMIN
    private Long customerId;

    private Long accountId;

    private String accountNumber;

    @NotNull(message = "Loan product ID is required")
    private Long loanProductId;

    @NotNull(message = "Requested amount is required")
    @DecimalMin(value = "100.00", message = "Requested amount must be at least 100.00")
    private BigDecimal requestedAmount;

    @NotNull(message = "Requested tenure in months is required")
    @Min(value = 1, message = "Requested tenure must be at least 1 month")
    private Integer requestedTenureMonths;

    private String purpose;

    @DecimalMin(value = "0.00", message = "Monthly income cannot be negative")
    private BigDecimal monthlyIncome;

    @DecimalMin(value = "0.00", message = "Monthly expenses cannot be negative")
    private BigDecimal monthlyExpenses;

    private String remarks;
}
