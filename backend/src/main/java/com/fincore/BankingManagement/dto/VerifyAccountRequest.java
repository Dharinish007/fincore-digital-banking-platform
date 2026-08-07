package com.fincore.BankingManagement.dto;

import lombok.Data;

@Data
public class VerifyAccountRequest {
    private String action;
    private String remarks;
}
