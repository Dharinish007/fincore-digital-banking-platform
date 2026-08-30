package com.bankingsystem.complianceservice.service;

import com.bankingsystem.complianceservice.client.KycServiceClient;
import com.bankingsystem.complianceservice.client.SanctionsListChecker;
import com.bankingsystem.complianceservice.dto.ComplianceCheckRequest;
import com.bankingsystem.complianceservice.dto.ComplianceCheckResponse;
import com.bankingsystem.complianceservice.dto.KycProfileDTO;
import com.bankingsystem.complianceservice.entity.ComplianceCheck;
import com.bankingsystem.complianceservice.entity.ComplianceVerdict;
import com.bankingsystem.complianceservice.repository.ComplianceCheckRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ComplianceCheckService {
    // Mock thresholds — tune these for your demo, not real regulatory figures.
    private static final BigDecimal LARGE_TRANSACTION_THRESHOLD = new BigDecimal("100000");
    private static final BigDecimal HIGH_RISK_OCCUPATION_THRESHOLD = new BigDecimal("10000");

    private final KycServiceClient kycServiceClient;
    private final SanctionsListChecker sanctionsListChecker;
    private final ComplianceCheckRepository repository;

    public ComplianceCheckService(KycServiceClient kycServiceClient,
                                  SanctionsListChecker sanctionsListChecker,
                                  ComplianceCheckRepository repository) {
        this.kycServiceClient = kycServiceClient;
        this.sanctionsListChecker = sanctionsListChecker;
        this.repository = repository;
    }

    public ComplianceCheckResponse check(ComplianceCheckRequest request) {

        KycProfileDTO profile = kycServiceClient.getProfile(request.getKycId());

        List<String> rejectReasons = new ArrayList<>();
        List<String> flagReasons = new ArrayList<>();

        // Rule 1: sanctions/watchlist match -> hard reject
        if (sanctionsListChecker.isSanctioned(profile.getGovernmentIdNumber())) {
            rejectReasons.add("Matched sanctions watchlist");
        }

        // Rule 2: PEP -> flag for enhanced due diligence
        if (profile.isPepDeclaration()) {
            flagReasons.add("Politically Exposed Person — enhanced due diligence required");
        }

        // Rule 3: large transaction -> flag
        if (request.getAmount().compareTo(LARGE_TRANSACTION_THRESHOLD) > 0) {
            flagReasons.add("Transaction exceeds compliance threshold of " + LARGE_TRANSACTION_THRESHOLD);
        }

        // Rule 4: high-risk occupation + non-trivial amount -> flag
        boolean highRiskOccupation = profile.getOccupationStatus() != null &&
                (profile.getOccupationStatus().equalsIgnoreCase("Student")
                        || profile.getOccupationStatus().equalsIgnoreCase("Self-Employed"));
        if (highRiskOccupation && request.getAmount().compareTo(HIGH_RISK_OCCUPATION_THRESHOLD) > 0) {
            flagReasons.add("High-risk occupation profile with elevated transaction amount");
        }

        ComplianceVerdict verdict;
        List<String> allReasons = new ArrayList<>();

        if (!rejectReasons.isEmpty()) {
            verdict = ComplianceVerdict.REJECTED;
            allReasons.addAll(rejectReasons);
            allReasons.addAll(flagReasons);
        } else if (!flagReasons.isEmpty()) {
            verdict = ComplianceVerdict.FLAGGED;
            allReasons.addAll(flagReasons);
        } else {
            verdict = ComplianceVerdict.APPROVED;
            allReasons.add("No compliance issues detected");
        }

        String reasonsJoined = String.join("; ", allReasons);

        ComplianceCheck record = new ComplianceCheck();
        record.setKycId(request.getKycId());
        record.setAmount(request.getAmount());
        record.setVerdict(verdict);
        record.setReasons(reasonsJoined);
        record.setPerformedBy(request.getPerformedBy());
        repository.save(record);

        return new ComplianceCheckResponse(request.getKycId(), verdict, reasonsJoined);
    }
}
