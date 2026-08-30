package com.bankingsystem.complianceservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ComplianceCheckRequest {
    @NotNull
    private Long kycId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;

    private String performedBy;
}
