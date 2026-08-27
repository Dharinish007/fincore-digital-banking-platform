package com.example.milestone3.operations;

import java.math.BigDecimal;

public final class OperationsDtos {
    private OperationsDtos() { }

    public record EmiRequest(BigDecimal principal, BigDecimal annualRate, int tenureMonths) { }
    public record EmiResult(BigDecimal emi, BigDecimal totalInterest, BigDecimal totalPayable) { }
    public record DisbursementRequest(Long loanId, BigDecimal amount, String channel) { }
    public record CollectionRequest(Long loanId, Long scheduleId, BigDecimal amount, String channel) { }
    public record LifecycleRequest(String status) { }
    public record BalanceAdjustmentRequest(BigDecimal amount, String entryType, String description) { }
    public record CustomerRequest(String fullName, String email, String phoneNumber, String accountNumber) { }
}
