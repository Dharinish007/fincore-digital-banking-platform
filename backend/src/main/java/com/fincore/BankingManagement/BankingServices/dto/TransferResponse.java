package com.fincore.BankingManagement.BankingServices.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@NoArgsConstructor
public class TransferResponse {
    private String transactionId;
    private String sender;

    private BigDecimal amount;
    private BigDecimal balance;
    private String status;
    private LocalDate date;
    private String message;
    public TransferResponse(String string, String success, BigDecimal amount, BigDecimal balance, LocalDate now) {
        this.transactionId = string;
        this.sender = success;
        this.amount = amount;
        this.balance = balance;
        this.status = success;
        this.date = now;
        this.message = "Money Transferred Successfully";
    }
}
