package com.example.milestone2loanmanagement.disbursement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementRequest {

    private Long loanId;

    private BigDecimal amount;

    private String beneficiaryAccount;
}