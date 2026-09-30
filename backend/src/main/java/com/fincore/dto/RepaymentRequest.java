package com.fincore.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class RepaymentRequest {
    @NotBlank(message = "Loan ID is required")
    private String loanId;

    private String scheduleId;

    @NotBlank(message = "Debit Account ID is required")
    private String debitAccountId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Repayment amount must be greater than zero")
    private BigDecimal amount;

    private String paymentMethod;
    private String performedBy;
}
