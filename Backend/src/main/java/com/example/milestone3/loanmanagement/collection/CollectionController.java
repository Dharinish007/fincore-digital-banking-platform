package com.example.milestone3.loanmanagement.collection;

import com.example.milestone3.audit.AuditLogService;
import com.example.milestone3.loanmanagement.collection.DTO.CollectionResponse;
import com.example.milestone3.loanmanagement.collection.DTO.CreateCollectionRequest;
import com.example.milestone3.loanmanagement.collection.DTO.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collection")
public class CollectionController {
    @Autowired
    private CollectionService collectionService;
    @Autowired
    private AuditLogService auditLogService;

    @PostMapping
    public ResponseEntity<CollectionResponse> createCollection(@RequestBody CreateCollectionRequest request) {
        CollectionResponse response = collectionService.createCollection(request);
        auditLogService.record(null, "COLLECTIONS_AGENT", "COLLECTION_SCHEDULE_CREATED", "LOAN_MANAGEMENT",
                "COLLECTION", String.valueOf(request.getEmiId()), "EMI collection scheduled for EMI #" + request.getEmiId() + " (Due: " + request.getAmountDue() + ")", "SUCCESS", null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionResponse> getCollection(@PathVariable Long id) {
        return ResponseEntity.ok(collectionService.getCollection(id));
    }

    @GetMapping("/loan/{loanId}")
    public ResponseEntity<List<CollectionResponse>> getCollectionsByLoan(@PathVariable Long loanId) {
        return ResponseEntity.ok(collectionService.getCollectionsByLoan(loanId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<CollectionResponse>> getOverdueCollections() {
        return ResponseEntity.ok(collectionService.getOverdueCollections());
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<CollectionResponse> recordPayment(@PathVariable Long id, @RequestBody PaymentRequest request) {
        CollectionResponse response = collectionService.recordPayment(id, request);
        auditLogService.record(null, "COLLECTIONS_AGENT", "LOAN_REPAYMENT_COLLECTED", "LOAN_MANAGEMENT",
                "COLLECTION", id.toString(), "Loan repayment received: ₹" + request.getAmount() + " via " + request.getPaymentMode(), "SUCCESS", null);
        return ResponseEntity.ok(response);
    }
}
