package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class deleteDTO {
    private Long customerId;
    private String customerName;
    private String email;
    private Long phoneNo;
    private Long accountNumber;
    private String IFSCCode;
    private String branch;
    private  String remark;
}
