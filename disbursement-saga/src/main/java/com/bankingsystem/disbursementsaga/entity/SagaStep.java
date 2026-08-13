package com.bankingsystem.disbursementsaga.entity;

public enum SagaStep {
    KYC_CHECK,
    DEBIT_SOURCE,
    CREDIT_TARGET,
    AUDIT_LOG,
    DONE
}
