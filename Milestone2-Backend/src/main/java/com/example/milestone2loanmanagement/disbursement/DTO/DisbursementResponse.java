package com.example.milestone2loanmanagement.disbursement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementResponse {

    private Long id;

    private Long loanId;

    private BigDecimal amount;

    private LocalDateTime disbursementDate;

    private String referenceNumber;

    private String beneficiaryAccount;

    private String status;
}
