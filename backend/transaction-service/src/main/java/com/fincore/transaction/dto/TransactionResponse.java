package com.fincore.transaction.dto;

import com.fincore.transaction.entity.Transaction;
import com.fincore.transaction.entity.TransactionStatus;
import com.fincore.transaction.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Long id;
    private String referenceId;
    private String accountNumber;
    private String counterpartyAccountNumber;
    private TransactionType type;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private TransactionStatus status;
    private String remarks;
    private String currency = "USD";
    private LocalDateTime createdAt;

    public TransactionResponse(
            String referenceId,
            String accountNumber,
            String counterpartyAccountNumber,
            TransactionType type,
            BigDecimal amount,
            BigDecimal balanceAfter,
            TransactionStatus status,
            String remarks,
            LocalDateTime createdAt) {
        this.referenceId = referenceId;
        this.accountNumber = accountNumber;
        this.counterpartyAccountNumber = counterpartyAccountNumber;
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.status = status;
        this.remarks = remarks;
        this.createdAt = createdAt;
    }

    public String getReferenceNumber() {
        return referenceId;
    }

    public String getSourceAccountNumber() {
        return accountNumber;
    }

    public String getDestinationAccountNumber() {
        return counterpartyAccountNumber;
    }

    public String getDescription() {
        return remarks != null ? remarks : "";
    }

    public LocalDateTime getTransactionDate() {
        return createdAt;
    }

    public static TransactionResponse from(Transaction tx) {
        if (tx == null) return null;
        TransactionResponse resp = new TransactionResponse(
                tx.getReferenceId(),
                tx.getAccountNumber(),
                tx.getCounterpartyAccountNumber(),
                tx.getType(),
                tx.getAmount(),
                tx.getBalanceAfter(),
                tx.getStatus(),
                tx.getRemarks(),
                tx.getCreatedAt()
        );
        resp.setId(tx.getId());
        return resp;
    }
}
