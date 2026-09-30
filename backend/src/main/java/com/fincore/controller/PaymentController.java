package com.fincore.controller;

import com.fincore.dto.ApiResponse;
import com.fincore.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private AuditService auditService;

    // Simulated beneficiaries store
    private final List<Map<String, Object>> beneficiaries = new ArrayList<>();

    public PaymentController() {
        // Seed default beneficiaries
        Map<String, Object> b1 = new HashMap<>();
        b1.put("id", "BEN-101");
        b1.put("customerId", "CUST-1001");
        b1.put("name", "Aarav Mehta");
        b1.put("accountNumber", "ACC-88392019");
        b1.put("ifsc", "HDFC0001822");
        b1.put("upiId", "aarav@okhdfcbank");
        b1.put("type", "IMPS");
        b1.put("status", "VERIFIED");
        beneficiaries.add(b1);

        Map<String, Object> b2 = new HashMap<>();
        b2.put("id", "BEN-102");
        b2.put("customerId", "CUST-1001");
        b2.put("name", "Priya Sharma");
        b2.put("accountNumber", "ACC-77482910");
        b2.put("ifsc", "SBIN0004921");
        b2.put("upiId", "priya@oksbi");
        b2.put("type", "UPI");
        b2.put("status", "VERIFIED");
        beneficiaries.add(b2);
    }

    @GetMapping("/beneficiaries")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBeneficiaries(@RequestParam(required = false) String customerId) {
        return ResponseEntity.ok(ApiResponse.ok("Beneficiaries retrieved", beneficiaries));
    }

    @PostMapping("/beneficiaries")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addBeneficiary(@RequestBody Map<String, String> request) {
        Map<String, Object> b = new HashMap<>();
        String id = "BEN-" + (100 + beneficiaries.size() + 1);
        b.put("id", id);
        b.put("name", request.getOrDefault("name", "New Beneficiary"));
        b.put("accountNumber", request.getOrDefault("accountNumber", "ACC-" + System.currentTimeMillis() % 100000000));
        b.put("ifsc", request.getOrDefault("ifsc", "FINC0001001"));
        b.put("upiId", request.getOrDefault("upiId", ""));
        b.put("type", request.getOrDefault("type", "IMPS"));
        b.put("status", "VERIFIED");
        b.put("addedAt", LocalDateTime.now().toString());

        beneficiaries.add(b);

        auditService.recordAudit(
                "BENEFICIARY_ADDED",
                "Beneficiary",
                id,
                request.getOrDefault("performedBy", "Customer"),
                "CUSTOMER",
                "Registered new beneficiary: " + b.get("name") + " (" + b.get("accountNumber") + ")"
        );

        return ResponseEntity.ok(ApiResponse.ok("Beneficiary registered and verified", b));
    }

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> initiatePayment(@RequestBody Map<String, Object> request) {
        String type = (String) request.getOrDefault("rail", "IMPS"); // IMPS, NEFT, UPI
        Double amount = Double.valueOf(request.getOrDefault("amount", 0.0).toString());
        String srcAcc = (String) request.get("sourceAccount");
        String destAcc = (String) request.get("destinationAccount");

        // Team B Milestone 3: Fraud detection velocity and risk check
        boolean fraudFlag = amount > 500000;
        String riskScore = fraudFlag ? "HIGH" : "LOW";

        Map<String, Object> response = new HashMap<>();
        String txnId = "PAY-" + System.currentTimeMillis();
        response.put("paymentReference", txnId);
        response.put("rail", type);
        response.put("amount", amount);
        response.put("sourceAccount", srcAcc);
        response.put("destinationAccount", destAcc);
        response.put("riskScore", riskScore);
        response.put("status", fraudFlag ? "FLAGGED_FOR_REVIEW" : "SETTLED");
        response.put("timestamp", LocalDateTime.now().toString());

        auditService.recordAudit(
                "PAYMENT_INITIATED",
                "Transaction",
                txnId,
                (String) request.getOrDefault("performedBy", "Customer"),
                "CUSTOMER",
                "Initiated " + type + " payment of ₹" + amount + " to " + destAcc + ". Fraud Check: " + riskScore
        );

        return ResponseEntity.ok(ApiResponse.ok("Payment processed through " + type + " clearing gateway", response));
    }
}
