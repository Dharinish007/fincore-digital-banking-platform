package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class updateDTO {
    private Long customerId;
    private String phone;
    private String email;
    private String name;
    private String address;
}
