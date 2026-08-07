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

    private String referenceId;
    private String accountNumber;
    private String counterpartyAccountNumber;
    private TransactionType type;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private TransactionStatus status;
    private String remarks;
    private LocalDateTime createdAt;

    public static TransactionResponse from(Transaction tx) {
        return new TransactionResponse(
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
    }
}
