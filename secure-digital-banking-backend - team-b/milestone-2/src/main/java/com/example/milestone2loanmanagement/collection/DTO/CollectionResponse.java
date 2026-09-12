package com.example.milestone2loanmanagement.collection.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionResponse {
    private Long id;

    private Long loanId;

    private Long emiId;

    private BigDecimal amountDue;

    private BigDecimal amountCollected;

    private BigDecimal remainingAmount;

    private LocalDate dueDate;

    private LocalDate collectionDate;

    private Integer daysOverdue;

    private String status;

}
