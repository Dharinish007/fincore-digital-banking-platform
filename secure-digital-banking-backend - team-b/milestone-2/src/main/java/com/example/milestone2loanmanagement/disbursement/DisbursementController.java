package com.example.milestone2loanmanagement.disbursement;

import com.example.milestone2loanmanagement.disbursement.DTO.DisbursementRequest;
import com.example.milestone2loanmanagement.disbursement.DTO.DisbursementResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disbursement")
public class DisbursementController {
    @Autowired
    private DisbursementService service;
    @PostMapping
    public ResponseEntity<DisbursementResponse> create(@RequestBody DisbursementRequest request) {

        return ResponseEntity.ok(
                service.createDisbursement(request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisbursementResponse>getById(@PathVariable Long id){
        return ResponseEntity.ok(service.getDisbursement(id));
    }
    @GetMapping("/loan/{id}")
    public ResponseEntity<List<DisbursementResponse>>getAll(@PathVariable Long id){
        return ResponseEntity.ok(service.getByLoan(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DisbursementResponse>updateStatus(@PathVariable Long id,@RequestBody String request){
        return ResponseEntity.ok(service.updateStatus(id,request));
    }
}
