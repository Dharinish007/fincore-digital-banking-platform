package com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class statementResponseDTO {


        private Integer transactionId;
        private String accountNumber;
        private BigDecimal amount;
        private String transactionType;
        private String status;
        private LocalDateTime transactionDate;
        private String remarks;

}
