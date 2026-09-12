package com.example.milestone2loanmanagement.EMI;

import com.example.milestone2loanmanagement.EMI.DTO.emiGetResponse;
import com.example.milestone2loanmanagement.EMI.DTO.EmiCalculationRequest;
import com.example.milestone2loanmanagement.EMI.DTO.EmiCalculationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emi")
public class EMIController {
    @Autowired
    private EMIService service;

    @GetMapping("/calculate")
    public ResponseEntity<EmiCalculationResponse>getEmi(@RequestBody EmiCalculationRequest EmiCalculationRequest){
        return ResponseEntity.ok(service.calculate(EmiCalculationRequest));
    }

    @PostMapping("/schedule/{loanId}")
    public ResponseEntity<List<emiGetResponse>> generateSchedule(@PathVariable Long loanId) {

        return ResponseEntity.ok(
                service.generateSchedule(loanId)
        );
    }
    @GetMapping("/loan/{loanId}")
    public ResponseEntity<List<emiGetResponse>> getEmisByLoan(@PathVariable Long loanId) {

        return ResponseEntity.ok(
                service.getEmisByLoan(loanId)
        );
    }
}
