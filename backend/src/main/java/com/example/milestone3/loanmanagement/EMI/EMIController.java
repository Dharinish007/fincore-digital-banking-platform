package com.example.milestone3.loanmanagement.EMI;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.loanmanagement.EMI.DTO.emiGetResponse;
import com.example.milestone3.loanmanagement.EMI.DTO.EmiCalculationRequest;
import com.example.milestone3.loanmanagement.EMI.DTO.EmiCalculationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emi")
public class EMIController {
    @Autowired
    private EMIService service;
    @Autowired
    private AuditLogService auditLogService;

    @PostMapping("/calculate")
    public ResponseEntity<EmiCalculationResponse> calculateEmi(@RequestBody EmiCalculationRequest EmiCalculationRequest) {
        EmiCalculationResponse response = service.calculate(EmiCalculationRequest);
        auditLogService.record(null, "LOAN_SYSTEM", "EMI_CALCULATED", "LOAN_MANAGEMENT",
                "LOAN_CALC", "N/A", "Reducing-balance EMI calculated for principal: " + EmiCalculationRequest.getPrincipalAmount(), "SUCCESS", null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/calculate")
    public ResponseEntity<EmiCalculationResponse> getEmi(@RequestBody(required = false) EmiCalculationRequest EmiCalculationRequest) {
        if (EmiCalculationRequest == null) {
            EmiCalculationRequest = new EmiCalculationRequest();
        }
        EmiCalculationResponse response = service.calculate(EmiCalculationRequest);
        auditLogService.record(null, "LOAN_SYSTEM", "EMI_CALCULATED", "LOAN_MANAGEMENT",
                "LOAN_CALC", "N/A", "Reducing-balance EMI calculated for principal: " + EmiCalculationRequest.getPrincipalAmount(), "SUCCESS", null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/schedule/{loanId}")
    public ResponseEntity<List<emiGetResponse>> generateSchedule(@PathVariable Long loanId) {
        List<emiGetResponse> schedule = service.generateSchedule(loanId);
        auditLogService.record(null, "LOAN_OFFICER", "EMI_SCHEDULE_GENERATED", "LOAN_MANAGEMENT",
                "LOAN", loanId.toString(), "Generated complete amortization repayment schedule for loan #" + loanId, "SUCCESS", null);
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/loan/{loanId}")
    public ResponseEntity<List<emiGetResponse>> getEmisByLoan(@PathVariable Long loanId) {
        return ResponseEntity.ok(service.getEmisByLoan(loanId));
    }
}
