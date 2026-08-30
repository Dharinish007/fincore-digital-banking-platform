package com.bankingsystem.disbursementsaga.dto;

import com.bankingsystem.disbursementsaga.entity.SagaStatus;
import com.bankingsystem.disbursementsaga.entity.SagaStep;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DisbursementResponse {

    private String sagaId;
    private SagaStatus status;
    private SagaStep currentStep;
    private String message;
}
