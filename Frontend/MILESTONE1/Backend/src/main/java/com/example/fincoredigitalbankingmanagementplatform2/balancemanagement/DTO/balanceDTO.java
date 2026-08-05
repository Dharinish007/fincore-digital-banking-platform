package com.example.fincoredigitalbankingmanagementplatform2.balancemanagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class balanceDTO {
    private Long transactionId;
    private BigDecimal amount;
    private String transactionType;
    private String status;
    private LocalDateTime transactionDate;
    private String remarks;

}