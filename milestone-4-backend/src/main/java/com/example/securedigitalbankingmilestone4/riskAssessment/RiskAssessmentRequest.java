package com.example.securedigitalbankingmilestone4.riskAssessment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RiskAssessmentRequest {
    private double amount;
    private Long userId;
    private Long transactionId;
}
