package com.example.milestone3.settlementEngine;

import com.example.milestone3.settlementEngine.entity.Settlement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
public class SettlementController {
    @Autowired
    private SettlementService settlementService;

    @PostMapping("/{transactionId}")
    public ResponseEntity<Settlement> settleTransaction(
            @PathVariable Long transactionId) {

        Settlement settlement =
                settlementService.settlePayment(transactionId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(settlement);
    }
}