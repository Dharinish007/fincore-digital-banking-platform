package com.fincore.BankingManagement.Milestone3.beneficiaryverification.dto;

import com.fincore.BankingManagement.Milestone3.beneficiaryverification.enums.Beneficiary_type;
import com.fincore.BankingManagement.Milestone3.beneficiaryverification.enums.Status;
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
