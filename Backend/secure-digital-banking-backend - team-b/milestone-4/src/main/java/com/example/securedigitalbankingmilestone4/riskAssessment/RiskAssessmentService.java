package com.example.securedigitalbankingmilestone4.riskAssessment;

import com.example.securedigitalbankingmilestone4.auditLogging.AuditLog;
import com.example.securedigitalbankingmilestone4.auditLogging.AuditRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RiskAssessmentService {

    private final RiskAssessmentRepo riskAssessmentRepo;
    private final AuditRepo auditLogRepo;

    public RiskAssessmentService(
            RiskAssessmentRepo riskAssessmentRepo,
            AuditRepo auditLogRepo) {

        this.riskAssessmentRepo = riskAssessmentRepo;
        this.auditLogRepo = auditLogRepo;
    }

    public RiskAssessment assessRisk(
            RiskAssessmentRequest assessment,
            String currentIpAddress,
            boolean livenessPassed) {

        int riskScore = 0;

        StringBuilder reasons = new StringBuilder();

        double amount = assessment.getAmount();

        if (amount >= 500000) {

            riskScore += 40;

            reasons.append(
                    "Very high transaction amount. "
            );

        } else if (amount >= 100000) {

            riskScore += 20;

            reasons.append(
                    "High transaction amount. "
            );

        }


        String lastKnownIp =
                getLastKnownIp(assessment.getUserId());

        if (lastKnownIp != null
                && currentIpAddress != null
                && !lastKnownIp.equals(currentIpAddress)) {

            riskScore += 15;

            reasons.append(
                    "Transaction originated from a different "
                            + "IP address than recent activity. "
            );
        }


        if (!livenessPassed) {

            riskScore += 20;

            reasons.append(
                    "Liveness verification failed. "
            );
        }



        riskScore = Math.min(riskScore, 100);


        String riskLevel;

        if (riskScore <= 30) {

            riskLevel = "LOW";

        } else if (riskScore <= 60) {

            riskLevel = "MEDIUM";

        } else {

            riskLevel = "HIGH";
        }


        String decision;

        if ("LOW".equals(riskLevel)) {

            decision = "ALLOW";

        } else if ("MEDIUM".equals(riskLevel)) {

            decision = "REVIEW";

        } else {

            decision = "BLOCK";
        }

        if (reasons.length() == 0) {

            reasons.append(
                    "No significant risk factors detected."
            );
        }

        RiskAssessment assessment1=new RiskAssessment();
        assessment1.setUserId(assessment.getUserId());

        assessment1.setTransactionId(assessment.getTransactionId());

        assessment1.setAmount(assessment.getAmount());

        assessment1.setRiskScore(riskScore);

        assessment1.setRiskLevel(riskLevel);

        assessment1.setDecision(decision);

        assessment1.setReason(reasons.toString());

        assessment1.setTime(LocalDateTime.now());

        return riskAssessmentRepo.save(assessment1);
    }



    private String getLastKnownIp(Long userId) {

        List<AuditLog> logs =
                auditLogRepo.findRecentByUserId(
                        userId
                );

        if (logs == null || logs.isEmpty()) {
            return null;
        }

        for (AuditLog log : logs) {

            if (log.getIpAddress() != null
                    && !log.getIpAddress().isBlank()) {

                return log.getIpAddress();
            }
        }

        return null;
    }


    public List<RiskAssessment> getAllAssessments() {

        return riskAssessmentRepo.findAll();
    }


    public RiskAssessment getByTransactionId(Long transactionId) {

        return (RiskAssessment) riskAssessmentRepo
                .findByTransactionId(transactionId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Risk assessment not found for transaction: "
                                        + transactionId
                        )
                );
    }


    public List<RiskAssessment> getByUserId(Long userId) {

        return riskAssessmentRepo.findByUserId(userId);
    }


    public List<RiskAssessment> getHighRiskTransactions() {

        return riskAssessmentRepo
                .findByRiskLevel("HIGH");
    }
}