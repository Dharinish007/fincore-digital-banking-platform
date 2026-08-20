package com.fincore.loan.dto;

import com.fincore.loan.entity.LoanApplication;
import com.fincore.loan.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplicationResponse {

    private Long id;
    private String applicationNumber;
    private Long customerId;
    private Long accountId;
    private String accountNumber;
    private LoanProductResponse loanProduct;
    private BigDecimal requestedAmount;
    private Integer requestedTenureMonths;
    private String purpose;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private ApplicationStatus status;
    private String rejectionReason;
    private String remarks;
    private CreditAssessmentResponse creditAssessment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LoanApplicationResponse from(LoanApplication app) {
        if (app == null) return null;
        return LoanApplicationResponse.builder()
                .id(app.getId())
                .applicationNumber(app.getApplicationNumber())
                .customerId(app.getCustomerId())
                .accountId(app.getAccountId())
                .accountNumber(app.getAccountNumber())
                .loanProduct(LoanProductResponse.from(app.getLoanProduct()))
                .requestedAmount(app.getRequestedAmount())
                .requestedTenureMonths(app.getRequestedTenureMonths())
                .purpose(app.getPurpose())
                .monthlyIncome(app.getMonthlyIncome())
                .monthlyExpenses(app.getMonthlyExpenses())
                .status(app.getStatus())
                .rejectionReason(app.getRejectionReason())
                .remarks(app.getRemarks())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
