package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class registerDTO {
    private String email;
    private String FirstName;
    private String LastName;
    private String phoneNumber;
    private String password;
}
