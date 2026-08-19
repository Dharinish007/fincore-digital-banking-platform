package com.fincore.kyc_service.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fincore.kyc_service.dto.KycRequestDTO;
import com.fincore.kyc_service.dto.KycResponseDTO;
import com.fincore.kyc_service.service.KycService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class KycController {
	
	@GetMapping("/api/v1/kyc/all")
	public List<KycResponseDTO> getAllKyc() {
	    return kycService.getAllKyc();
	}


    @Autowired
    private KycService kycService;

    @PostMapping("/api/v1/kyc/submit")
    public KycResponseDTO submitKyc(@Valid @RequestBody KycRequestDTO request) {
        return kycService.submitKyc(request);
    }

    @GetMapping("/api/v1/kyc/status/{kycId}")
    public KycResponseDTO getKycStatus(@PathVariable Long kycId) {
        return kycService.getKycStatus(kycId);
    }

    @PutMapping("/api/v1/kyc/approve")
    public KycResponseDTO approveKyc(@RequestBody KycRequestDTO request) {
        return kycService.approveKyc(request);
    }

    @PutMapping("/api/v1/kyc/reject")
    public KycResponseDTO rejectKyc(@RequestBody KycRequestDTO request) {
        return kycService.rejectKyc(request);
    }
}