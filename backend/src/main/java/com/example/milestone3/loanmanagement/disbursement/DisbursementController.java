package com.example.milestone3.loanmanagement.disbursement;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.loanmanagement.disbursement.DTO.DisbursementRequest;
import com.example.milestone3.loanmanagement.disbursement.DTO.DisbursementResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disbursement")
public class DisbursementController {
    @Autowired
    private DisbursementService service;
    @Autowired
    private AuditLogService auditLogService;

    @PostMapping
    public ResponseEntity<DisbursementResponse> create(@RequestBody DisbursementRequest request) {
        DisbursementResponse response = service.createDisbursement(request);
        auditLogService.record(null, "LOAN_OFFICER", "LOAN_DISBURSEMENT_INITIATED", "LOAN_MANAGEMENT",
                "DISBURSEMENT", String.valueOf(request.getLoanId()), "Disbursement initiated for loan #" + request.getLoanId() + " (Amount: ₹" + request.getAmount() + ")", "SUCCESS", null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisbursementResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDisbursement(id));
    }

    @GetMapping("/loan/{id}")
    public ResponseEntity<List<DisbursementResponse>> getAll(@PathVariable Long id) {
        return ResponseEntity.ok(service.getByLoan(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DisbursementResponse> updateStatus(@PathVariable Long id, @RequestBody String request) {
        DisbursementResponse response = service.updateStatus(id, request);
        auditLogService.record(null, "LOAN_OFFICER", "DISBURSEMENT_STATUS_UPDATED", "LOAN_MANAGEMENT",
                "DISBURSEMENT", id.toString(), "Disbursement tranche #" + id + " updated to status: " + request, "SUCCESS", null);
        return ResponseEntity.ok(response);
    }
}
