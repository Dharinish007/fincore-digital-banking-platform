package com.bankingsystem.disbursementsaga.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplianceCheckResponse {
    private Long kycId;
    private String verdict; // APPROVED, FLAGGED, REJECTED
    private String reasons;
}
