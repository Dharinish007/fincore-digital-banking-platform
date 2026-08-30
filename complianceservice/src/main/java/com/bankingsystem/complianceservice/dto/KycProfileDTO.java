package com.bankingsystem.complianceservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KycProfileDTO {
    private Long kycId;
    private String status;
    private String governmentIdNumber;
    private boolean pepDeclaration;
    private String occupationStatus;
    private String annualIncomeRange;
}
