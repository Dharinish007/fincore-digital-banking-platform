package com.fincore.BankingManagement.Milestone2.CreditCheck.Controller;

import com.fincore.BankingManagement.Milestone2.CreditCheck.Service.CreditCheckServiceImpl;
import com.fincore.BankingManagement.Milestone2.CreditCheck.dto.CreditCheckRequest;
import com.fincore.BankingManagement.Milestone2.CreditCheck.dto.CreditCheckResponse;
import com.fincore.BankingManagement.Milestone2.CreditCheck.dto.CustomerLookupResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = { "/api/credit-check", "/api/credit-checks" })
public class CreditCheckController {

    @Autowired
    private CreditCheckServiceImpl service;

    @GetMapping
    public List<CreditCheckResponse> getAllCreditChecks() {
        return service.getAllCreditChecks();
    }

    @PostMapping
    public CreditCheckResponse saveCreditCheck(@RequestBody CreditCheckRequest request) {
        return service.saveCreditCheck(request);
    }

    @GetMapping("/customer/{customerId}")
    public CustomerLookupResponse getCustomer(@PathVariable Long customerId) {
        return service.getCustomerProfile(customerId);
    }

    @PostMapping("/evaluate")
    public CreditCheckResponse evaluateEligibility(@RequestBody CreditCheckRequest request) {
        return service.evaluateEligibility(request);
    }
}
