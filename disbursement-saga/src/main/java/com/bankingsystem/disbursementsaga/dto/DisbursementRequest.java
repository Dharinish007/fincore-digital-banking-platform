package com.bankingsystem.disbursementsaga.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DisbursementRequest {
    @NotNull
    private Long kycId;

    @NotBlank
    private String sourceAccount;

    @NotBlank
    private String targetAccount;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;

    private String performedBy;
}
