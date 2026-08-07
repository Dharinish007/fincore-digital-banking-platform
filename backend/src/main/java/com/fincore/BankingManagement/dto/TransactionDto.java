package com.fincore.BankingManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {
    private String id;
    private String sender;
    private String senderName;
    private String receiver;
    private String receiverName;
    private String type;
    private BigDecimal amount;
    private String date;
    private String reference;
    private String status;
    private String remarks;
    private String failureReason;
    private String description;
    private BigDecimal charges;
}
