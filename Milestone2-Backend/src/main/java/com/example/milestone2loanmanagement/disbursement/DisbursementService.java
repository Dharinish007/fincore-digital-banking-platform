package com.example.milestone2loanmanagement.disbursement;

import com.example.milestone2loanmanagement.collection.LoanEntity;
import com.example.milestone2loanmanagement.collection.LoanRepo;
import com.example.milestone2loanmanagement.disbursement.DTO.DisbursementRequest;
import com.example.milestone2loanmanagement.disbursement.DTO.DisbursementResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@Service
public class DisbursementService {
    @Autowired
    private DisbursementRepo disbursementRepo;
    @Autowired
    private LoanRepo loanRepo;
    public DisbursementResponse createDisbursement(DisbursementRequest request) {
        LoanEntity loan = loanRepo.findById(request.getLoanId())
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));

        // Basic validation
        if (request.getAmount().signum() <= 0) {
            throw new RuntimeException(
                    "Disbursement amount must be greater than zero");
        } if (request.getAmount()
                .compareTo(loan.getPrincipalAmount()) > 0) {

            throw new RuntimeException(
                    "Disbursement amount cannot exceed loan amount");
        }

        DisbursementEntity disbursement = new DisbursementEntity();

        disbursement.setLoan(loan);
        disbursement.setAmount(request.getAmount());
        disbursement.setBeneficiaryAccount(
                request.getBeneficiaryAccount());

        disbursement.setDisbursementDate(
                LocalDateTime.now());

        disbursement.setReferenceNumber(
                UUID.randomUUID().toString());

        disbursement.setStatus("PENDING");
        DisbursementEntity saved =
                disbursementRepo.save(disbursement);

        return convertToResponse(saved);
    }

    public DisbursementResponse updateStatus(Long id, String request) {

        DisbursementEntity disbursement =
                disbursementRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Disbursement not found"));

        disbursement.setStatus(request);

        DisbursementEntity updated =
                disbursementRepo.save(disbursement);

        return convertToResponse(updated);
    }

    public DisbursementResponse getDisbursement(Long id) {

        DisbursementEntity disbursement =
                disbursementRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Disbursement not found"));

        return convertToResponse(disbursement);
    }

    public List<DisbursementResponse> getByLoan(Long loanId) {

        if (!loanRepo.existsById(loanId)) {
            throw new RuntimeException("Loan not found");
        }

        return disbursementRepo
                .findByLoanId(loanId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private DisbursementResponse convertToResponse(DisbursementEntity disbursement) {

        return new DisbursementResponse(
                disbursement.getId(),
                disbursement.getLoan().getId(),
                disbursement.getAmount(),
                disbursement.getDisbursementDate(),
                disbursement.getReferenceNumber(),
                disbursement.getBeneficiaryAccount(),
                disbursement.getStatus()
        );
    }
}
