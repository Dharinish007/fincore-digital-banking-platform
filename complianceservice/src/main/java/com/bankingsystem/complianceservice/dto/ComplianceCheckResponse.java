package com.bankingsystem.complianceservice.dto;

import com.bankingsystem.complianceservice.entity.ComplianceVerdict;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ComplianceCheckResponse {

    private Long kycId;
    private ComplianceVerdict verdict;
    private String reasons;

}
