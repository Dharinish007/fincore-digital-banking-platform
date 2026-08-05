package com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.DTO;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
@Data
public class statementRequestDTO {
    String accountNumber;
    LocalDate startDate;
    LocalDate endDate;
}