package com.example.milestone2loanmanagement.collection;

import com.example.milestone2loanmanagement.collection.DTO.CollectionResponse;
import com.example.milestone2loanmanagement.collection.DTO.CreateCollectionRequest;
import com.example.milestone2loanmanagement.collection.DTO.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collection")
public class CollectionController {
    @Autowired
    private CollectionService collectionService;

    @PostMapping
    public ResponseEntity<CollectionResponse> createCollection(@RequestBody CreateCollectionRequest request) {
        return ResponseEntity.ok(collectionService.createCollection(request));
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
    public ResponseEntity<CollectionResponse> recordPayment(@PathVariable Long id,@RequestBody PaymentRequest request) {

        return ResponseEntity.ok(collectionService.recordPayment(id, request));
    }

}
