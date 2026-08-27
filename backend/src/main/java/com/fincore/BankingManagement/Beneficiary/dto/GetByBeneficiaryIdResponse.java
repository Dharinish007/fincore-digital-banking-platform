package com.fincore.BankingManagement.Beneficiary.dto;

import com.fincore.BankingManagement.Beneficiary.enums.Beneficiary_type;
import com.fincore.BankingManagement.Beneficiary.enums.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GetByBeneficiaryIdResponse {
    private long beneficiary_id;
    private String name;
    private String AccountNumber;
    private String ifsc;
    private String Bank;
    private Beneficiary_type beneficiary_type;
    private Status status;

    public GetByBeneficiaryIdResponse(String accountNumber, Status status, String name, String ifsc, Beneficiary_type beneficiary_type, long beneficiary_id, String bank) {
        this.AccountNumber = accountNumber;
        this.status = status;
        this.name = name;
        this.ifsc = ifsc;
        this.beneficiary_type = beneficiary_type;
        this.beneficiary_id = beneficiary_id;
        this.Bank = bank;
    }

}
