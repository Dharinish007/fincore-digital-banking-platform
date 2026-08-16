package com.bankingapp.originationservice.service;

import com.bankingapp.originationservice.client.CreditAssessmentClient;
import com.bankingapp.originationservice.client.LoanClient;
import com.bankingapp.originationservice.dto.*;
import com.bankingapp.originationservice.entity.LoanOriginationStage;
import com.bankingapp.originationservice.entity.OriginationApplication;
import com.bankingapp.originationservice.enums.AssessmentResult;
import com.bankingapp.originationservice.enums.StageName;
import com.bankingapp.originationservice.enums.StageStatus;
import com.bankingapp.originationservice.exception.ResourceNotFoundException;
import com.bankingapp.originationservice.exception.WorkflowConflictException;
import com.bankingapp.originationservice.repository.LoanOriginationStageRepository;
import com.bankingapp.originationservice.repository.OriginationApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OriginationService {

    private final LoanOriginationStageRepository stageRepository;
    private final OriginationApplicationRepository applicationRepository;
    private final CreditAssessmentClient creditAssessmentClient;
    private final LoanClient loanClient;

    public OriginationService(
            LoanOriginationStageRepository stageRepository,
            OriginationApplicationRepository applicationRepository, CreditAssessmentClient creditAssessmentClient, LoanClient loanClient) {

        this.stageRepository = stageRepository;
        this.applicationRepository = applicationRepository;
        this.creditAssessmentClient = creditAssessmentClient;
        this.loanClient = loanClient;
    }


    public List<LoanOriginationStage> getStagesByLoanId(Long loanId) {

        return stageRepository.findByLoanId(loanId);
    }

    public LoanOriginationStage startApplication(
            OriginationApplicationRequest request) {

        // Create and save application
        OriginationApplication application =
                new OriginationApplication();

        application.setCustomerId(request.getCustomerId());
        application.setLoanAmount(request.getLoanAmount());
        application.setInterestRate(request.getInterestRate());
        application.setTenureMonths(request.getTenureMonths());

        application.setMonthlyIncome(request.getMonthlyIncome());
        application.setMonthlyObligations(request.getMonthlyObligations());
        application.setAge(request.getAge());
        application.setYearsEmployed(request.getYearsEmployed());
        application.setCreditHistoryYears(
                request.getCreditHistoryYears());
        application.setSavingsBalance(
                request.getSavingsBalance());
        application.setExistingLoanCount(
                request.getExistingLoanCount());
        application.setDefaultHistoryCount(
                request.getDefaultHistoryCount());

        OriginationApplication savedApplication =
                applicationRepository.save(application);

        // Create first origination stage
        LoanOriginationStage stage =
                new LoanOriginationStage();

        stage.setApplicationId(
                savedApplication.getApplicationId());

        // Loan does not exist yet
        stage.setLoanId(null);

        stage.setStageName(
                StageName.APPLICATION_RECEIVED);

        stage.setStageStatus(
                StageStatus.IN_PROGRESS);

        stage.setStartedAt(
                LocalDateTime.now());

        return stageRepository.save(stage);
    }

    public LoanOriginationStage completeStage(
            Long stageId) {

        LoanOriginationStage currentStage =
                stageRepository.findById(stageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Origination stage not found with ID: "
                                                + stageId));

        // Stage must currently be in progress
        if (currentStage.getStageStatus()
                != StageStatus.IN_PROGRESS) {

            throw new WorkflowConflictException(
                    "Only an IN_PROGRESS stage can be completed");
        }

        // Only normal workflow stages can use this endpoint
        if (currentStage.getStageName()
                != StageName.APPLICATION_RECEIVED
                && currentStage.getStageName()
                != StageName.DOCUMENT_VERIFICATION) {

            throw new WorkflowConflictException(
                    "This stage cannot be completed using the generic completion endpoint");
        }

        // Complete current stage
        currentStage.setStageStatus(
                StageStatus.COMPLETED);

        currentStage.setCompletedAt(
                LocalDateTime.now());

        stageRepository.save(currentStage);

        // Determine next stage
        StageName nextStageName =
                getNextStage(currentStage.getStageName());

        if (nextStageName == null) {
            return currentStage;
        }

        // Create next stage
        LoanOriginationStage nextStage =
                new LoanOriginationStage();

        nextStage.setApplicationId(
                currentStage.getApplicationId());

        nextStage.setLoanId(
                currentStage.getLoanId());

        nextStage.setStageName(
                nextStageName);

        nextStage.setStageStatus(
                StageStatus.IN_PROGRESS);

        nextStage.setStartedAt(
                LocalDateTime.now());

        stageRepository.save(nextStage);

        return currentStage;
    }

    public LoanOriginationStage processCreditAssessmentResult(
            Long stageId) {

        LoanOriginationStage currentStage =
                stageRepository.findById(stageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Origination stage not found with ID: "
                                                + stageId));

        if (currentStage.getStageName()
                != StageName.CREDIT_ASSESSMENT) {

            throw new WorkflowConflictException(
                    "Only CREDIT_ASSESSMENT stage can be processed");
        }

        if (currentStage.getStageStatus()
                != StageStatus.IN_PROGRESS) {

            throw new WorkflowConflictException(
                    "Credit Assessment stage is not in progress");
        }

        // Get the application
        OriginationApplication application =
                applicationRepository.findById(
                                currentStage.getApplicationId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Origination application not found with ID: "
                                                + currentStage.getApplicationId()));

        // Build Credit Assessment request
        CreditAssessmentRequest request =
                new CreditAssessmentRequest();

        request.setCustomerId(
                application.getCustomerId());

        request.setMonthlyIncome(
                application.getMonthlyIncome());

        request.setMonthlyObligations(
                application.getMonthlyObligations());

        request.setLoanAmount(
                application.getLoanAmount());

        request.setAge(
                application.getAge());

        request.setYearsEmployed(
                application.getYearsEmployed());

        request.setCreditHistoryYears(
                application.getCreditHistoryYears());

        request.setSavingsBalance(
                application.getSavingsBalance());

        request.setExistingLoanCount(
                application.getExistingLoanCount());

        request.setDefaultHistoryCount(
                application.getDefaultHistoryCount());

        // Call Loan Service's Credit Assessment
        CreditAssessmentResponse response =
                creditAssessmentClient.assess(request);

        // Complete current stage
        currentStage.setStageStatus(
                StageStatus.COMPLETED);

        currentStage.setCompletedAt(
                LocalDateTime.now());

        currentStage.setRemarks(
                "Credit assessment: "
                        + response.getDecision()
                        + ", score: "
                        + response.getScore()
                        + ", risk: "
                        + response.getRiskLevel());

        stageRepository.save(currentStage);

        // Determine next stage
        StageName nextStage;

        boolean rejected =
                "REJECTED".equalsIgnoreCase(
                        response.getDecision());

        if (rejected) {
            nextStage = StageName.REJECTED;
        } else {
            nextStage = StageName.UNDERWRITING_REVIEW;
        }

        LoanOriginationStage nextStageRecord =
                new LoanOriginationStage();

        nextStageRecord.setApplicationId(
                currentStage.getApplicationId());

        nextStageRecord.setLoanId(
                currentStage.getLoanId());

        nextStageRecord.setStageName(nextStage);

        nextStageRecord.setStartedAt(
                LocalDateTime.now());

        if (rejected) {

            nextStageRecord.setStageStatus(
                    StageStatus.COMPLETED);

            nextStageRecord.setCompletedAt(
                    LocalDateTime.now());

        } else {

            nextStageRecord.setStageStatus(
                    StageStatus.IN_PROGRESS);
        }

        return stageRepository.save(nextStageRecord);
    }
    private StageName getNextStage(
            StageName currentStage) {

        return switch (currentStage) {

            case APPLICATION_RECEIVED ->
                    StageName.DOCUMENT_VERIFICATION;

            case DOCUMENT_VERIFICATION ->
                    StageName.CREDIT_ASSESSMENT;

            default ->
                    null;
        };
    }

    public LoanOriginationStage completeUnderwriting(
            Long stageId,
            boolean approved,
            String remarks) {

        LoanOriginationStage stage =
                stageRepository.findById(stageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Origination stage not found with ID: "
                                                + stageId));

        if (stage.getStageName()
                != StageName.UNDERWRITING_REVIEW) {

            throw new WorkflowConflictException(
                    "Only UNDERWRITING_REVIEW can be completed through underwriting");
        }

        if (stage.getStageStatus()
                != StageStatus.IN_PROGRESS) {

            throw new WorkflowConflictException(
                    "Underwriting stage is not in progress");
        }

        // Complete underwriting stage
        stage.setStageStatus(StageStatus.COMPLETED);
        stage.setCompletedAt(LocalDateTime.now());
        stage.setRemarks(remarks);

        stageRepository.save(stage);

        // If rejected, do NOT create a loan
        if (!approved) {

            LoanOriginationStage rejectedStage =
                    new LoanOriginationStage();

            rejectedStage.setApplicationId(
                    stage.getApplicationId());

            rejectedStage.setLoanId(
                    null);

            rejectedStage.setStageName(
                    StageName.REJECTED);

            rejectedStage.setStageStatus(
                    StageStatus.COMPLETED);

            rejectedStage.setStartedAt(
                    LocalDateTime.now());

            rejectedStage.setCompletedAt(
                    LocalDateTime.now());

            rejectedStage.setRemarks(remarks);

            return stageRepository.save(rejectedStage);
        }

        // Get application
        OriginationApplication application =
                applicationRepository.findById(
                                stage.getApplicationId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Origination application not found with ID: "
                                                + stage.getApplicationId()));

        // Build Loan Service request
        LoanRequest loanRequest =
                new LoanRequest();

        loanRequest.setCustomerId(
                application.getCustomerId());

        loanRequest.setLoanAmount(
                application.getLoanAmount());

        loanRequest.setInterestRate(
                application.getInterestRate());

        loanRequest.setTenureMonths(
                application.getTenureMonths());

        // Create loan in Loan Service
        LoanResponse loanResponse =
                loanClient.createLoan(loanRequest);

        // Save Loan Service ID in Origination Application
        application.setLoanAccountId(
                loanResponse.getLoanAccountId());

        applicationRepository.save(application);

        // Create APPROVED stage
        LoanOriginationStage approvedStage =
                new LoanOriginationStage();

        approvedStage.setApplicationId(
                stage.getApplicationId());

        approvedStage.setLoanId(
                loanResponse.getLoanAccountId());

        approvedStage.setStageName(
                StageName.APPROVED);

        approvedStage.setStageStatus(
                StageStatus.COMPLETED);

        approvedStage.setStartedAt(
                LocalDateTime.now());

        approvedStage.setCompletedAt(
                LocalDateTime.now());

        approvedStage.setRemarks(
                "Loan created successfully. Loan Number: "
                        + loanResponse.getLoanNumber());

        return stageRepository.save(approvedStage);
    }

    public List<LoanOriginationStage> getStagesByApplicationId(
            Long applicationId) {

        return stageRepository.findByApplicationId(applicationId);
    }
}