package com.fincore.loan.dto;

import com.fincore.loan.entity.LoanProduct;
import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanType;
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
public class LoanProductResponse {

    private Long id;
    private String productCode;
    private String name;
    private LoanType loanType;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private BigDecimal interestRate;
    private Integer minTenureMonths;
    private Integer maxTenureMonths;
    private BigDecimal processingFeePercentage;
    private LoanProductStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LoanProductResponse from(LoanProduct p) {
        if (p == null) return null;
        return LoanProductResponse.builder()
                .id(p.getId())
                .productCode(p.getProductCode())
                .name(p.getName())
                .loanType(p.getLoanType())
                .minAmount(p.getMinAmount())
                .maxAmount(p.getMaxAmount())
                .interestRate(p.getInterestRate())
                .minTenureMonths(p.getMinTenureMonths())
                .maxTenureMonths(p.getMaxTenureMonths())
                .processingFeePercentage(p.getProcessingFeePercentage())
                .status(p.getStatus())
                .description(p.getDescription())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
