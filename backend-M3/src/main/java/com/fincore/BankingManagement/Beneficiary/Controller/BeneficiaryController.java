package com.fincore.BankingManagement.Beneficiary.Controller;

import com.fincore.BankingManagement.Beneficiary.dto.BeneficiaryResponse;
import com.fincore.BankingManagement.Beneficiary.service.BeneficiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("beneficiary-verification")
public class BeneficiaryController {

    @Autowired
    private BeneficiaryService service;

    @GetMapping("/getList")
    public List<BeneficiaryResponse> getList(){
        return service.findAll();
    }
}
