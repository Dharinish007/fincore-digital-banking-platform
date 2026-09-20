package com.fincore.loan.dto;

import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanType;
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
public class LoanProductRequest {

    @NotBlank(message = "Product code is required")
    @Size(max = 50, message = "Product code must be at most 50 characters")
    private String productCode;

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must be at most 100 characters")
    private String name;

    @NotNull(message = "Loan type is required")
    private LoanType loanType;

    @NotNull(message = "Minimum amount is required")
    @DecimalMin(value = "100.00", message = "Minimum amount must be at least 100.00")
    private BigDecimal minAmount;

    @NotNull(message = "Maximum amount is required")
    @DecimalMin(value = "100.00", message = "Maximum amount must be at least 100.00")
    private BigDecimal maxAmount;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.00", message = "Interest rate cannot be negative")
    @DecimalMax(value = "100.00", message = "Interest rate cannot exceed 100%")
    private BigDecimal interestRate;

    @NotNull(message = "Minimum tenure is required")
    @Min(value = 1, message = "Minimum tenure must be at least 1 month")
    private Integer minTenureMonths;

    @NotNull(message = "Maximum tenure is required")
    @Min(value = 1, message = "Maximum tenure must be at least 1 month")
    private Integer maxTenureMonths;

    @DecimalMin(value = "0.00", message = "Processing fee percentage cannot be negative")
    @DecimalMax(value = "20.00", message = "Processing fee percentage cannot exceed 20%")
    private BigDecimal processingFeePercentage;

    private LoanProductStatus status;

    private String description;
}
