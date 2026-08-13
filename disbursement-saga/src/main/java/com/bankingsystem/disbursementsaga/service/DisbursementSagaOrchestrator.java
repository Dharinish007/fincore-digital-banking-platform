package com.bankingsystem.disbursementsaga.service;

import com.bankingsystem.disbursementsaga.client.AuditTrailClient;
import com.bankingsystem.disbursementsaga.client.CoreBankingClient;
import com.bankingsystem.disbursementsaga.client.KycServiceClient;
import com.bankingsystem.disbursementsaga.dto.AccountResponse;
import com.bankingsystem.disbursementsaga.dto.AuditLogRequest;
import com.bankingsystem.disbursementsaga.dto.DisbursementRequest;
import com.bankingsystem.disbursementsaga.dto.DisbursementResponse;
import com.bankingsystem.disbursementsaga.entity.DisbursementSagaEntity;
import com.bankingsystem.disbursementsaga.entity.SagaStatus;
import com.bankingsystem.disbursementsaga.entity.SagaStep;
import com.bankingsystem.disbursementsaga.enums.AccountStatus;
import com.bankingsystem.disbursementsaga.repository.DisbursementSagaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DisbursementSagaOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(DisbursementSagaOrchestrator.class);

    private final DisbursementSagaRepository sagaRepository;
    private final KycServiceClient kycClient;
    private final CoreBankingClient coreBankingClient;
    private final AuditTrailClient auditTrailClient;

    public DisbursementSagaOrchestrator(DisbursementSagaRepository sagaRepository,
                                        KycServiceClient kycClient,
                                        CoreBankingClient coreBankingClient,
                                        AuditTrailClient auditTrailClient) {
        this.sagaRepository = sagaRepository;
        this.kycClient = kycClient;
        this.coreBankingClient = coreBankingClient;
        this.auditTrailClient = auditTrailClient;
    }

    public DisbursementResponse run(DisbursementRequest request) {

        // 1. Create + persist saga record
        DisbursementSagaEntity saga = new DisbursementSagaEntity();
        saga.setSagaId(UUID.randomUUID().toString());
        saga.setKycId(request.getKycId());
        saga.setSourceAccount(request.getSourceAccount());
        saga.setTargetAccount(request.getTargetAccount());
        saga.setAmount(request.getAmount());
        saga.setStatus(SagaStatus.STARTED);
        saga.setCurrentStep(SagaStep.KYC_CHECK);
        sagaRepository.save(saga);

        boolean debited = false;

        try {
            // ---- STEP 1: KYC check ----
            saga.setStatus(SagaStatus.IN_PROGRESS);
            sagaRepository.save(saga);

            if (!kycClient.isKycApproved(request.getKycId())) {
                throw new RuntimeException("KYC not approved for kycId " + request.getKycId());
            }

            // ---- STEP 2: Debit source account ----
            saga.setCurrentStep(SagaStep.DEBIT_SOURCE);
            sagaRepository.save(saga);

            AccountResponse source = coreBankingClient.getAccountByNumber(request.getSourceAccount());
            if (source.getStatus() != AccountStatus.ACTIVE) {
                throw new RuntimeException("Source account " + request.getSourceAccount() + " is not ACTIVE");
            }
            if (source.getBalance().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException("Insufficient balance in source account " + request.getSourceAccount());
            }

            coreBankingClient.debit(source, request.getAmount());
            debited = true;

            // ---- STEP 3: Credit target account ----
            saga.setCurrentStep(SagaStep.CREDIT_TARGET);
            sagaRepository.save(saga);

            AccountResponse target = coreBankingClient.getAccountByNumber(request.getTargetAccount());
            if (target.getStatus() != AccountStatus.ACTIVE) {
                throw new RuntimeException("Target account " + request.getTargetAccount() + " is not ACTIVE");
            }

            coreBankingClient.credit(target, request.getAmount());

            // ---- STEP 4: Audit log (non-fatal on failure) ----
            saga.setCurrentStep(SagaStep.AUDIT_LOG);
            sagaRepository.save(saga);

            auditTrailClient.log(new AuditLogRequest(
                    "DISBURSEMENT",
                    saga.getSagaId(),
                    "DISBURSE",
                    request.getPerformedBy() == null ? "SYSTEM" : request.getPerformedBy(),
                    "SUCCESS",
                    "Disbursed " + request.getAmount() + " from " + request.getSourceAccount()
                            + " to " + request.getTargetAccount(),
                    LocalDateTime.now()
            ));

            // ---- DONE ----
            saga.setCurrentStep(SagaStep.DONE);
            saga.setStatus(SagaStatus.COMPLETED);
            sagaRepository.save(saga);

            return new DisbursementResponse(saga.getSagaId(), saga.getStatus(), saga.getCurrentStep(),
                    "Disbursement completed successfully");

        } catch (Exception ex) {
            log.error("Saga {} failed at step {}: {}", saga.getSagaId(), saga.getCurrentStep(), ex.getMessage());

            saga.setStatus(SagaStatus.COMPENSATING);
            saga.setFailureReason(ex.getMessage());
            sagaRepository.save(saga);

            // Compensation: undo the debit if it happened
            if (debited) {
                try {
                    AccountResponse sourceForRefund = coreBankingClient.getAccountByNumber(request.getSourceAccount());
                    coreBankingClient.credit(sourceForRefund, request.getAmount());
                    log.info("Compensation: refunded {} to {}", request.getAmount(), request.getSourceAccount());
                } catch (Exception compEx) {
                    // Money is stuck mid-flight.
                    log.error("COMPENSATION FAILED for saga {} — manual intervention required: {}",
                            saga.getSagaId(), compEx.getMessage());
                }
            }

            auditTrailClient.log(new AuditLogRequest(
                    "DISBURSEMENT",
                    saga.getSagaId(),
                    "DISBURSE",
                    request.getPerformedBy() == null ? "SYSTEM" : request.getPerformedBy(),
                    "FAILED",
                    "Disbursement failed: " + ex.getMessage(),
                    LocalDateTime.now()
            ));

            saga.setStatus(SagaStatus.FAILED);
            sagaRepository.save(saga);

            return new DisbursementResponse(saga.getSagaId(), saga.getStatus(), saga.getCurrentStep(),
                    "Disbursement failed: " + ex.getMessage());
        }
    }
}

