package com.example.risk_scoring_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.risk_scoring_service.dto.RiskAssessmentRequestDTO;
import com.example.risk_scoring_service.dto.RiskAssessmentResponseDTO;
import com.example.risk_scoring_service.dto.RiskStatisticsDTO;
import com.example.risk_scoring_service.entity.RiskAssessmentHistory;
import com.example.risk_scoring_service.enums.RiskLevel;
import com.example.risk_scoring_service.enums.RiskStatus;
import com.example.risk_scoring_service.service.RiskAssessmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/risks")
public class RiskAssessmentController {

    private final RiskAssessmentService riskAssessmentService;

    public RiskAssessmentController(
            RiskAssessmentService riskAssessmentService) {

        this.riskAssessmentService =
                riskAssessmentService;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<RiskAssessmentResponseDTO>
    createRiskAssessment(
            @Valid @RequestBody RiskAssessmentRequestDTO request) {

        return ResponseEntity.ok(
                riskAssessmentService
                        .createRiskAssessment(request));
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<List<RiskAssessmentResponseDTO>>
    getAllRiskAssessments() {

        return ResponseEntity.ok(
                riskAssessmentService
                        .getAllRiskAssessments());
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{riskId}")
    public ResponseEntity<RiskAssessmentResponseDTO>
    getRiskAssessmentById(
            @PathVariable Long riskId) {

        return ResponseEntity.ok(
                riskAssessmentService
                        .getRiskAssessmentById(riskId));
    }

    // =========================================================
    // HISTORY
    // =========================================================

    @GetMapping("/{riskId}/history")
    public ResponseEntity<List<RiskAssessmentHistory>>
    getRiskHistory(
            @PathVariable Long riskId) {

        return ResponseEntity.ok(
                riskAssessmentService
                        .getRiskHistory(riskId));
    }

    // =========================================================
    // STATISTICS
    // =========================================================

    @GetMapping("/statistics")
    public ResponseEntity<RiskStatisticsDTO>
    getRiskStatistics() {

        return ResponseEntity.ok(
                riskAssessmentService
                        .getRiskStatistics());
    }

    // =========================================================
    // SEARCH + FILTER
    // =========================================================

    @GetMapping("/search")
    public ResponseEntity<List<RiskAssessmentResponseDTO>>
    searchRiskAssessments(

            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            RiskLevel riskLevel,

            @RequestParam(required = false)
            RiskStatus riskStatus) {

        return ResponseEntity.ok(
                riskAssessmentService
                        .searchRiskAssessments(
                                search,
                                riskLevel,
                                riskStatus));
    }

    // =========================================================
    // REASSESS
    // =========================================================

    @PostMapping("/{riskId}/reassess")
    public ResponseEntity<RiskAssessmentResponseDTO>
    reassessRisk(
            @PathVariable Long riskId) {

        return ResponseEntity.ok(
                riskAssessmentService
                        .reassessRisk(riskId));
    }
}