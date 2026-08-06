package com.fincore.BankingManagement.BankingServices.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private BigDecimal amount;
}
