package com.example.milestone2loanmanagement.collection.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCollectionRequest {

    private Long emiId;

    private BigDecimal amountDue;

    private LocalDate dueDate;
}
