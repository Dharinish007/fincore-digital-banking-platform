package com.fincore.transaction.dto;

import com.fincore.transaction.entity.AccountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateAccountRequest {

    @NotBlank(message = "customerName is required")
    private String customerName;

    @NotNull(message = "accountType is required")
    private AccountType accountType;

    @DecimalMin(value = "0.00", message = "openingBalance cannot be negative")
    private BigDecimal openingBalance = BigDecimal.ZERO;
}
