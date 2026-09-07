package com.example.securedigitalbankingmilestone4.riskAssessment;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/riskAssessment")
public class RiskAssessmentController {
    @Autowired
    private RiskAssessmentService service;

    @PostMapping("/assess")
    public ResponseEntity<RiskAssessment>assessRisk(@RequestBody RiskAssessmentRequest request, HttpServletRequest servletRequest){
        String ipAddress=servletRequest.getRemoteAddr();
        return ResponseEntity.ok(service.assessRisk(request,ipAddress,true));
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<RiskAssessment> getByTransactionId(@PathVariable Long transactionId) {
        return ResponseEntity.ok(
                service.getByTransactionId(
                        transactionId
                )
        );
    }


    @GetMapping("/user/{userId}")
    public List<RiskAssessment> getByUserId(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }


    @GetMapping("/high-risk")
    public List<RiskAssessment> getHighRiskTransactions() {
        return service.getHighRiskTransactions();
    }
}
