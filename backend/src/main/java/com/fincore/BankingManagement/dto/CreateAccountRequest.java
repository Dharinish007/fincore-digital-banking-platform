package com.fincore.BankingManagement.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateAccountRequest {
    private String fullname;
    private String email;
    private String mobile;
    private String dob;
    private String pan;
    private String aadhaar;
    private String address;
    private String occupation;
    private BigDecimal income;
    private String nomineeName;
    private String nomineeRelation;
    private String branch;
    private String accountType;
    private BigDecimal initialDeposit;
    private String password;
}
