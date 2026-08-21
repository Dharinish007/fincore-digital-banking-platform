package com.fincore.BankingManagement.Beneficiary.Controller;

import com.fincore.BankingManagement.Beneficiary.dto.BeneficiaryResponse;
import com.fincore.BankingManagement.Beneficiary.dto.GetByBeneficiaryIdResponse;
import com.fincore.BankingManagement.Beneficiary.service.BeneficiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("getById/{id}")
    public ResponseEntity<?> getById(@PathVariable long id){
        GetByBeneficiaryIdResponse response=service.findById(id);
        if(response!=null){
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.ok("null");
    }
}
