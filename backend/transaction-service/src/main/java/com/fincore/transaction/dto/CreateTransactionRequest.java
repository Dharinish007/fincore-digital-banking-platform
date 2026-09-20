package com.fincore.transaction.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.DecimalMin;
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
public class CreateTransactionRequest {

    @JsonAlias({"sourceAccountId", "fromAccountNumber", "accountNumber"})
    private String sourceAccountId;

    @JsonAlias({"destinationAccountId", "toAccountNumber", "counterpartyAccountNumber"})
    private String destinationAccountId;

    @NotNull(message = "type is required")
    private String type;

    @NotNull(message = "amount is required")
    @DecimalMin(value = "0.01", message = "amount must be greater than 0")
    private BigDecimal amount;

    private String currency;

    @JsonAlias({"description", "remarks"})
    private String description;

    @JsonAlias({"referenceNumber", "referenceId"})
    private String referenceNumber;

    private String transactionDate;
}
