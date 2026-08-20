package com.fincore.BankingManagement.Beneficiary.dto;

import com.fincore.BankingManagement.Beneficiary.enums.Beneficiary_type;
import com.fincore.BankingManagement.Beneficiary.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryResponse {
    private String name;
    private String AccountNumber;
    private String ifsc;
    private String Bank;
    private Beneficiary_type beneficiary_type;
    private Status status;

    public BeneficiaryResponse(String beneficiaryName, String accountNo, String ifsc, String bankName, Beneficiary_type beneficiaryType) {
        this.name = beneficiaryName;
        this.AccountNumber = accountNo;
        this.ifsc = ifsc;
        this.Bank = bankName;
        this.beneficiary_type = beneficiaryType;
        this.status=status;
    }
}
