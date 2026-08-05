package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class loginDTO {
    private String email;
    private String password;

}