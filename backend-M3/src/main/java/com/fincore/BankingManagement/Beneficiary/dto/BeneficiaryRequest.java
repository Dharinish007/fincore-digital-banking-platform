package com.fincore.BankingManagement.Beneficiary.dto;

import com.fincore.BankingManagement.Beneficiary.enums.Beneficiary_type;
import com.fincore.BankingManagement.Beneficiary.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryRequest {
    private long beneficiary_id;
    private String name;
    private String AccountNumber;
    private String ifsc;
    private String Bank;
    private Beneficiary_type beneficiary_type;
    private Status status;
}
