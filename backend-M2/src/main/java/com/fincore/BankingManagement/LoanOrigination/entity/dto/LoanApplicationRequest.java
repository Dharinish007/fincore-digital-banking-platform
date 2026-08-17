package com.fincore.BankingManagement.LoanOrigination.entity.dto;

import com.fincore.BankingManagement.LoanOrigination.entity.LoanType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplicationRequest {

    // Customer ID (optional - can be created without existing customer)
    private Long customerId;

    // Personal Information
    private String fullName;
    private String customerName;
    private String dateOfBirth;
    private String gender;
    private String mobile;
    private String email;

    // Address Information
    private String address;
    private String city;
    private String state;
    private String pincode;

    // Employment Information
    private String employmentType;
    private String employerName;
    private String jobTitle;
    private String workExperience;

    // Income Information
    private BigDecimal monthlyIncome;
    private BigDecimal otherIncome;

    // Loan Information
    private LoanType loanType;
    private BigDecimal loanAmount;
    private BigDecimal requestedAmount;
    private Integer tenureMonths;
    private BigDecimal interestRate;
    private String purpose;

    // Application Status
    private String applicationStatus;

}