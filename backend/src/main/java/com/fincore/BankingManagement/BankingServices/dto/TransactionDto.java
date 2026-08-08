package com.fincore.BankingManagement.BankingServices.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDto {
    private String senderAccount;
    private String receiverAccount;
    private BigDecimal amount;
    private String transactionType;
    private String status;
    private LocalDateTime transactionDate;
}
