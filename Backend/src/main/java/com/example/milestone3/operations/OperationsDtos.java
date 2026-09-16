package com.example.milestone3.operations;

import java.math.BigDecimal;

public final class OperationsDtos {
    private OperationsDtos() { }

    public record EmiRequest(BigDecimal principal, BigDecimal annualRate, int tenureMonths) { }
    public record EmiResult(BigDecimal emi, BigDecimal totalInterest, BigDecimal totalPayable) { }
    public record DisbursementRequest(Long loanId, BigDecimal amount, String channel, Long beneficiaryAccountId) { }
    public record CollectionRequest(Long loanId, Long scheduleId, BigDecimal amount, String channel, Long sourceAccountId) { }
    public record LifecycleRequest(String status) { }
    public record BalanceAdjustmentRequest(BigDecimal amount, String entryType, String description) { }
    public record CustomerRequest(String fullName, String email, String phoneNumber, String accountNumber, java.time.LocalDate dateOfBirth, Long customerId) { }
    public record CreateAccountRequest(String accountNumber, Long customerId, String accountType, BigDecimal initialBalance, String status) { }
    public record CreateTransactionRequest(Long customerId, Long loanId, BigDecimal amount, String type, String status, String description, String transactionReference, Long accountId, Long targetAccountId, String recipientAccount, String location, String deviceIp) { }
    public record ApplyLoanRequest(Long customerId, String loanType, BigDecimal amount, BigDecimal interestRate, int tenureMonths, String purpose) { }
    public record LoanActionRequest(String remarks) { }
    public record AccountResponse(Long id, String accountNumber, Long customerId, String customerName, String customerEmail, String customerPhone, String accountType, BigDecimal balance, String status, java.time.LocalDate openedAt) { }
    public record LoanDetailResponse(Long id, String loanId, Long customerId, String customerName, String loanType, BigDecimal sanctionedAmount, BigDecimal disbursedAmount, BigDecimal remainingAmount, BigDecimal outstandingPrincipal, BigDecimal totalOutstanding, String status, BigDecimal interestRate, int tenureMonths, BigDecimal monthlyEmi) { }
}
