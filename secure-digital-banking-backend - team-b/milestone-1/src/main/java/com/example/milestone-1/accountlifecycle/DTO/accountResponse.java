package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class accountResponse {
    Integer accountId;
    String accountNumber;
    String status;
    LocalDateTime date;

}
