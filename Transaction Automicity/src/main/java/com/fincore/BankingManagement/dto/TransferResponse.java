package com.fincore.BankingManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TransferResponse {
    private String transactionId;
    private String sender;
    private String receiver;
    private BigDecimal amount;
    private BigDecimal balance;
    private String status;
    private LocalDateTime date;
    private String message;
    public TransferResponse(String string, String success, String moneyTransferredSuccessfully, BigDecimal amount, BigDecimal balance, LocalDateTime now) {
        this.transactionId = string;
        this.sender = success;
        this.receiver = moneyTransferredSuccessfully;
        this.amount = amount;
        this.balance = balance;
        this.status = success;
        this.date = now;
        this.message = moneyTransferredSuccessfully;
    }
}
