package com.fincore.customerservice.dto;

import com.fincore.customerservice.enums.CustomerStatus;
import com.fincore.customerservice.enums.KycStatus;
import com.fincore.customerservice.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {

    private Long id;
    private String customerNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private KycStatus kycStatus;
    private RiskLevel riskLevel;
    private CustomerStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
