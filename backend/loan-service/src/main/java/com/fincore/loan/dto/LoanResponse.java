package com.fincore.loan.dto;

import com.fincore.loan.entity.Loan;
import com.fincore.loan.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanResponse {

    private Long id;
    private String loanNumber;
    private Long applicationId;
    private Long customerId;
    private Long accountId;
    private String accountNumber;
    private Long loanProductId;
    private String loanProductName;
    private BigDecimal principalAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private BigDecimal emiAmount;
    private BigDecimal totalRepaymentAmount;
    private BigDecimal totalInterest;
    private BigDecimal outstandingAmount;
    private LoanStatus status;
    private LocalDateTime disbursedAt;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LoanResponse from(Loan loan) {
        if (loan == null) return null;
        return LoanResponse.builder()
                .id(loan.getId())
                .loanNumber(loan.getLoanNumber())
                .applicationId(loan.getApplicationId())
                .customerId(loan.getCustomerId())
                .accountId(loan.getAccountId())
                .accountNumber(loan.getAccountNumber())
                .loanProductId(loan.getLoanProductId())
                .loanProductName(loan.getLoanProductName())
                .principalAmount(loan.getPrincipalAmount())
                .interestRate(loan.getInterestRate())
                .tenureMonths(loan.getTenureMonths())
                .emiAmount(loan.getEmiAmount())
                .totalRepaymentAmount(loan.getTotalRepaymentAmount())
                .totalInterest(loan.getTotalInterest())
                .outstandingAmount(loan.getOutstandingAmount())
                .status(loan.getStatus())
                .disbursedAt(loan.getDisbursedAt())
                .startDate(loan.getStartDate())
                .endDate(loan.getEndDate())
                .createdAt(loan.getCreatedAt())
                .updatedAt(loan.getUpdatedAt())
                .build();
    }
}
