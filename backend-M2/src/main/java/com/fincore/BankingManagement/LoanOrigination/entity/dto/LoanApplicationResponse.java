package com.fincore.BankingManagement.LoanOrigination.entity.dto;

import com.fincore.BankingManagement.LoanOrigination.entity.ApplicationStatus;
import com.fincore.BankingManagement.LoanOrigination.entity.LoanType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplicationResponse {

    // Identifiers
    private Long loanId;
    private Long customerId;

    // Personal Information
    private String customerName;
    private String fullName;
    private LocalDate dateOfBirth;
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
    private Integer tenureMonths;
    private BigDecimal interestRate;
    private String purpose;

    // Application Status
    private ApplicationStatus applicationStatus;
    private LocalDate applicationDate;

    // Audit Information
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
