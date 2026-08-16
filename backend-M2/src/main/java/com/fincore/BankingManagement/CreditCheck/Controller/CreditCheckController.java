package com.fincore.BankingManagement.CreditCheck.Controller;

import com.fincore.BankingManagement.CreditCheck.Service.CreditCheckServiceImpl;
import com.fincore.BankingManagement.CreditCheck.dto.CreditCheckRequest;
import com.fincore.BankingManagement.CreditCheck.dto.CreditCheckResponse;
import com.fincore.BankingManagement.CreditCheck.dto.CustomerLookupResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = { "/credit-check", "/credit-checks" })
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
