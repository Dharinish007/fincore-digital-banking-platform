package com.example.milestone2loanmanagement.EMI.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class emiGetResponse {
    private Long id;

    private Long loanId;

    private Integer installmentNumber;

    private LocalDate dueDate;

    private BigDecimal emiAmount;

    private BigDecimal principalAmount;

    private BigDecimal interestAmount;

    private BigDecimal amountPaid;

    private LocalDate paymentDate;

    private String status;
}
