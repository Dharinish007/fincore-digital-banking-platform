package com.example.risk_scoring_service.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.risk_scoring_service.dto.RiskAssessmentRequestDTO;
import com.example.risk_scoring_service.dto.RiskAssessmentResponseDTO;
import com.example.risk_scoring_service.dto.RiskFactorDTO;
import com.example.risk_scoring_service.dto.RiskStatisticsDTO;
import com.example.risk_scoring_service.entity.RiskAssessment;
import com.example.risk_scoring_service.entity.RiskAssessmentHistory;
import com.example.risk_scoring_service.entity.RiskFactor;
import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;
import com.example.risk_scoring_service.repository.RiskAssessmentHistoryRepository;
import com.example.risk_scoring_service.repository.RiskAssessmentRepository;
import com.example.risk_scoring_service.repository.RiskFactorRepository;

@Service
public class RiskAssessmentServiceImpl
        implements RiskAssessmentService {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final RiskFactorRepository riskFactorRepository;
    private final RiskAssessmentHistoryRepository riskAssessmentHistoryRepository;
    private final RiskCalculationService riskCalculationService;

    public RiskAssessmentServiceImpl(
            RiskAssessmentRepository riskAssessmentRepository,
            RiskFactorRepository riskFactorRepository,
            RiskAssessmentHistoryRepository riskAssessmentHistoryRepository,
            RiskCalculationService riskCalculationService) {

        this.riskAssessmentRepository = riskAssessmentRepository;
        this.riskFactorRepository = riskFactorRepository;
        this.riskAssessmentHistoryRepository =
                riskAssessmentHistoryRepository;
        this.riskCalculationService =
                riskCalculationService;
    }

    // =========================================================
    // CREATE RISK ASSESSMENT
    // =========================================================

    @Override
    @Transactional
    public RiskAssessmentResponseDTO createRiskAssessment(
            RiskAssessmentRequestDTO request) {

        int transactionFrequency = 0;
        int latePayments = 0;
        boolean unusualActivity = false;

        // Determine calculation inputs from risk factors
        if (request.getRiskFactors() != null) {

            for (RiskFactorDTO factor :
                    request.getRiskFactors()) {

                String factorName =
                        factor.getFactor().toLowerCase();

                if (factorName.contains("frequent")) {
                    transactionFrequency = 11;
                }

                if (factorName.contains("late")) {
                    latePayments = 1;
                }

                if (factorName.contains("unusual")) {
                    unusualActivity = true;
                }
            }
        }

        // Calculate risk score
        int riskScore =
                riskCalculationService.calculateRiskScore(
                        request.getTransactionAmount(),
                        transactionFrequency,
                        latePayments,
                        unusualActivity
                );

        // Determine risk level
        RiskLevel riskLevel =
                riskCalculationService
                        .determineRiskLevel(riskScore);

        // Determine risk status
        RiskStatus riskStatus =
                riskCalculationService
                        .determineRiskStstus(riskLevel);

        // Create assessment
        RiskAssessment assessment =
                new RiskAssessment();

        assessment.setCustomerId(
                request.getCustomerId());

        assessment.setCustomerName(
                request.getCustomerName());

        assessment.setAccountNumber(
                request.getAccountNumber());

        assessment.setTransactionId(
                request.getTransactionId());

        assessment.setTransactionAmount(
                request.getTransactionAmount());

        assessment.setRiskScore(riskScore);

        assessment.setRiskLevel(riskLevel);

        assessment.setRiskStatus(riskStatus);

        LocalDateTime now =
                LocalDateTime.now();

        assessment.setAssessmentDate(now);
        assessment.setUpdatedDate(now);

        // Save assessment
        RiskAssessment savedAssessment =
                riskAssessmentRepository.save(assessment);

        // Save risk factors
        List<RiskFactor> savedFactors =
                new ArrayList<>();

        if (request.getRiskFactors() != null) {

            for (RiskFactorDTO factorDTO :
                    request.getRiskFactors()) {

                RiskFactor factor =
                        new RiskFactor();

                factor.setRiskAssessmentId(
                        savedAssessment.getId());

                factor.setFactor(
                        factorDTO.getFactor());

                factor.setDescription(
                        factorDTO.getDescription());

                RiskFactor savedFactor =
                        riskFactorRepository.save(factor);

                savedFactors.add(savedFactor);
            }
        }

        return convertToResponseDTO(
                savedAssessment,
                savedFactors);
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    public List<RiskAssessmentResponseDTO>
    getAllRiskAssessments() {

        List<RiskAssessment> assessments =
                riskAssessmentRepository.findAll();

        List<RiskAssessmentResponseDTO> responses =
                new ArrayList<>();

        for (RiskAssessment assessment :
                assessments) {

            List<RiskFactor> factors =
                    riskFactorRepository
                            .findByRiskAssessmentId(
                                    assessment.getId());

            responses.add(
                    convertToResponseDTO(
                            assessment,
                            factors));
        }

        return responses;
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    public RiskAssessmentResponseDTO
    getRiskAssessmentById(Long riskId) {

        RiskAssessment assessment =
                riskAssessmentRepository
                        .findById(riskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Risk assessment not found with ID: "
                                                + riskId));

        List<RiskFactor> factors =
                riskFactorRepository
                        .findByRiskAssessmentId(riskId);

        return convertToResponseDTO(
                assessment,
                factors);
    }

    // =========================================================
    // STATISTICS
    // =========================================================

    @Override
    public RiskStatisticsDTO getRiskStatistics() {

        List<RiskAssessment> assessments =
                riskAssessmentRepository.findAll();

        int total = assessments.size();

        int lowRiskCount = 0;
        int mediumRiskCount = 0;
        int highRiskCount = 0;

        int safeCount = 0;
        int reviewCount = 0;
        int flaggedCount = 0;

        double totalScore = 0;

        for (RiskAssessment assessment :
                assessments) {

            if (assessment.getRiskLevel()
                    == RiskLevel.LOW) {

                lowRiskCount++;

            } else if (assessment.getRiskLevel()
                    == RiskLevel.MEDIUM) {

                mediumRiskCount++;

            } else if (assessment.getRiskLevel()
                    == RiskLevel.HIGH) {

                highRiskCount++;
            }

            if (assessment.getRiskStatus()
                    == RiskStatus.SAFE) {

                safeCount++;

            } else if (assessment.getRiskStatus()
                    == RiskStatus.REVIEW) {

                reviewCount++;

            } else if (assessment.getRiskStatus()
                    == RiskStatus.FLAGGED) {

                flaggedCount++;
            }

            if (assessment.getRiskScore() != null) {

                totalScore +=
                        assessment.getRiskScore();
            }
        }

        double averageRiskScore =
                total == 0
                        ? 0
                        : totalScore / total;

        RiskStatisticsDTO statistics =
                new RiskStatisticsDTO();

        statistics.setTotalRiskAssessments(total);
        statistics.setLowRiskCount(lowRiskCount);
        statistics.setMediumRiskCount(mediumRiskCount);
        statistics.setHighRiskCount(highRiskCount);

        statistics.setSafeCount(safeCount);
        statistics.setReviewCount(reviewCount);
        statistics.setFlaggedCount(flaggedCount);

        statistics.setAverageRiskScore(
                averageRiskScore);

        return statistics;
    }

    // =========================================================
    // REASSESS RISK
    // =========================================================

    @Override
    @Transactional
    public RiskAssessmentResponseDTO
    reassessRisk(Long riskId) {

        // 1. Find existing assessment
        RiskAssessment assessment =
                riskAssessmentRepository
                        .findById(riskId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Risk assessment not found with ID: "
                                                + riskId));

        // 2. Save CURRENT assessment into history
        RiskAssessmentHistory history =
                new RiskAssessmentHistory();

        history.setRiskAssessmentId(
                assessment.getId());

        history.setRiskScore(
                assessment.getRiskScore());

        history.setRiskLevel(
                assessment.getRiskLevel());

        history.setRiskStatus(
                assessment.getRiskStatus());

        history.setAssessmentDate(
                assessment.getAssessmentDate());

        riskAssessmentHistoryRepository.save(history);

        // 3. Get existing risk factors
        List<RiskFactor> factors =
                riskFactorRepository
                        .findByRiskAssessmentId(riskId);

        // 4. Calculate inputs
        int transactionFrequency = 0;
        int latePayments = 0;
        boolean unusualActivity = false;

        for (RiskFactor factor : factors) {

            String factorName =
                    factor.getFactor().toLowerCase();

            if (factorName.contains("frequent")) {
                transactionFrequency = 11;
            }

            if (factorName.contains("late")) {
                latePayments = 1;
            }

            if (factorName.contains("unusual")) {
                unusualActivity = true;
            }
        }

        // 5. Calculate NEW score
        int newRiskScore =
                riskCalculationService.calculateRiskScore(
                        assessment.getTransactionAmount(),
                        transactionFrequency,
                        latePayments,
                        unusualActivity
                );

        // 6. Determine NEW level
        RiskLevel newRiskLevel =
                riskCalculationService
                        .determineRiskLevel(
                                newRiskScore);

        // 7. Determine NEW status
        RiskStatus newRiskStatus =
                riskCalculationService
                        .determineRiskStstus(
                                newRiskLevel);

        // 8. Update assessment
        assessment.setRiskScore(newRiskScore);

        assessment.setRiskLevel(newRiskLevel);

        assessment.setRiskStatus(newRiskStatus);

        assessment.setUpdatedDate(
                LocalDateTime.now());

        // 9. Save updated assessment
        RiskAssessment updatedAssessment =
                riskAssessmentRepository.save(
                        assessment);

        // 10. Return response
        return convertToResponseDTO(
                updatedAssessment,
                factors);
    }

    // =========================================================
    // GET RISK HISTORY
    // =========================================================

    @Override
    public List<RiskAssessmentHistory>
    getRiskHistory(Long riskId) {

        return riskAssessmentHistoryRepository
                .findByRiskAssessmentId(riskId);
    }

    // =========================================================
    // SEARCH
    // =========================================================

    @Override
    public List<RiskAssessmentResponseDTO>
    searchRiskAssessments(
            String search,
            RiskLevel riskLevel,
            RiskStatus riskStatus) {

        List<RiskAssessment> assessments =
                riskAssessmentRepository.findAll();

        List<RiskAssessmentResponseDTO> responses =
                new ArrayList<>();

        for (RiskAssessment assessment :
                assessments) {

            boolean matches = true;

            // Search
            if (search != null &&
                    !search.trim().isEmpty()) {

                String value =
                        search.toLowerCase().trim();

                boolean found =
                        String.valueOf(
                                assessment.getId())
                                .contains(value)

                        || String.valueOf(
                                assessment.getCustomerId())
                                .contains(value)

                        || assessment.getCustomerName()
                                .toLowerCase()
                                .contains(value)

                        || assessment.getAccountNumber()
                                .toLowerCase()
                                .contains(value)

                        || assessment.getTransactionId()
                                .toLowerCase()
                                .contains(value);

                if (!found) {
                    matches = false;
                }
            }

            // Risk level filter
            if (riskLevel != null &&
                    assessment.getRiskLevel()
                            != riskLevel) {

                matches = false;
            }

            // Risk status filter
            if (riskStatus != null &&
                    assessment.getRiskStatus()
                            != riskStatus) {

                matches = false;
            }

            if (matches) {

                List<RiskFactor> factors =
                        riskFactorRepository
                                .findByRiskAssessmentId(
                                        assessment.getId());

                responses.add(
                        convertToResponseDTO(
                                assessment,
                                factors));
            }
        }

        return responses;
    }

    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private RiskAssessmentResponseDTO
    convertToResponseDTO(
            RiskAssessment assessment,
            List<RiskFactor> factors) {

        RiskAssessmentResponseDTO response =
                new RiskAssessmentResponseDTO();

        response.setRiskId(
                assessment.getId());

        response.setCustomerId(
                assessment.getCustomerId());

        response.setCustomerName(
                assessment.getCustomerName());

        response.setAccountNumber(
                assessment.getAccountNumber());

        response.setTransactionId(
                assessment.getTransactionId());

        response.setTransactionAmount(
                assessment.getTransactionAmount());

        response.setRiskScore(
                assessment.getRiskScore());

        response.setRiskLevel(
                assessment.getRiskLevel());

        response.setRiskStatus(
                assessment.getRiskStatus());

        response.setAssessmentDate(
                assessment.getAssessmentDate());

        response.setUpdatedDate(
                assessment.getUpdatedDate());

        List<RiskFactorDTO> factorResponses =
                new ArrayList<>();

        for (RiskFactor factor : factors) {

            RiskFactorDTO factorDTO =
                    new RiskFactorDTO();

            factorDTO.setFactor(
                    factor.getFactor());

            factorDTO.setDescription(
                    factor.getDescription());

            factorResponses.add(factorDTO);
        }

        response.setRiskFactors(
                factorResponses);

        return response;
    }
}