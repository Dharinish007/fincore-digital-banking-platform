package com.fincore.loan.service;

import com.fincore.loan.dto.*;
import com.fincore.loan.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoanApplicationService {

    LoanApplicationResponse submitApplication(LoanApplicationRequest request);

    LoanApplicationResponse getApplicationById(Long id);

    LoanApplicationResponse getApplicationByNumber(String applicationNumber);

    Page<LoanApplicationResponse> getApplicationsByCustomerId(Long customerId, Pageable pageable);

    Page<LoanApplicationResponse> getAllApplications(Long customerId, ApplicationStatus status, Pageable pageable);

    CreditAssessmentResponse assessApplication(Long id);

    CreditAssessmentResponse getCreditAssessment(Long id);

    LoanResponse approveApplication(Long id, ApprovalRequest request);

    LoanApplicationResponse rejectApplication(Long id, RejectionRequest request);
}
