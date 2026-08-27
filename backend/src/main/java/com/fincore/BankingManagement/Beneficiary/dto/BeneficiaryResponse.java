package com.fincore.BankingManagement.Beneficiary.dto;

import com.fincore.BankingManagement.Beneficiary.enums.Beneficiary_type;
import com.fincore.BankingManagement.Beneficiary.enums.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BeneficiaryResponse {
    private long beneficiary_id;
    private String name;
    private String AccountNumber;
    private String ifsc;
    private String Bank;
    private Beneficiary_type beneficiary_type;
    private Status status;

    public BeneficiaryResponse(long beneficiary_id,String beneficiaryName, String AccountNumber, String ifsc, String bank, Beneficiary_type beneficiaryType,Status status) {
        this.beneficiary_id = beneficiary_id;
        this.name = beneficiaryName;
        this.AccountNumber = AccountNumber;
        this.ifsc = ifsc;
        this.Bank = bank;
        this.beneficiary_type = beneficiaryType;
        this.status=status;
    }
}
