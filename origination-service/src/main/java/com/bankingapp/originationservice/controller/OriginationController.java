package com.bankingapp.originationservice.controller;

import com.bankingapp.originationservice.dto.OriginationApplicationRequest;
import com.bankingapp.originationservice.dto.UnderwritingRequest;
import com.bankingapp.originationservice.entity.LoanOriginationStage;
import com.bankingapp.originationservice.service.OriginationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/origination")
public class OriginationController {

    private final OriginationService originationService;

    public OriginationController(OriginationService originationService) {
        this.originationService = originationService;
    }

    @PostMapping("/applications")
    public LoanOriginationStage startApplication(
            @Valid @RequestBody OriginationApplicationRequest request) {

        return originationService.startApplication(request);
    }

    @PutMapping("/stages/{stageId}/complete")
    public LoanOriginationStage completeStage(@PathVariable Long stageId) {

        return originationService.completeStage(stageId);
    }

    @PutMapping("/stages/{stageId}/underwriting")
    public LoanOriginationStage completeUnderwriting(
            @PathVariable Long stageId,
            @Valid @RequestBody UnderwritingRequest request) {

        return originationService.completeUnderwriting(
                stageId,
                request.getApproved(),
                request.getRemarks()
        );
    }

    @PutMapping("/stages/{stageId}/credit-assessment")
    public LoanOriginationStage processCreditAssessmentResult(
            @PathVariable Long stageId) {

        return originationService.processCreditAssessmentResult(stageId);
    }

    @GetMapping("/applications/{applicationId}/stages")
    public List<LoanOriginationStage> getStagesByApplicationId(
            @PathVariable Long applicationId) {

        return originationService
                .getStagesByApplicationId(applicationId);
    }
}