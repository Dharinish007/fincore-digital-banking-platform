package com.fincore.BankingManagement.Beneficiary.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fincore.BankingManagement.Beneficiary.dto.BeneficiaryRequest;
import com.fincore.BankingManagement.Beneficiary.dto.BeneficiaryResponse;
import com.fincore.BankingManagement.Beneficiary.dto.GetByBeneficiaryIdResponse;
import com.fincore.BankingManagement.Beneficiary.service.BeneficiaryService;

@RestController
@RequestMapping("beneficiary-verification")
@CrossOrigin("*")
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
    @PutMapping("/updateDetails")
    public ResponseEntity<?> updateDetails(@RequestBody BeneficiaryRequest request){
        BeneficiaryResponse response=service.updateDetails(request);
        if(response!=null) {
            return ResponseEntity.ok(response);
        }
        return null;
    }
}
