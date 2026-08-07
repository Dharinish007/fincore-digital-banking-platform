package com.fincore.BankingManagement.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {
    private String sender;
    private String receiver;
    private String type;
    private BigDecimal amount;
    private String reference;
    private String date;
    private String description;
}
