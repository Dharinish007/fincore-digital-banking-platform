package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class deleteDTO {
    private Integer customerId;
    private String customerName;
    private String email;
    private String phoneNo;
    private Integer accountNumber;
    private String IFSCCode;
    private String branch;
    private String remark;
}
