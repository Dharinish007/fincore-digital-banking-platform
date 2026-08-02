package com.fincore.kyc_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.fincore.kyc_service.dto.KycRequestDTO;
import com.fincore.kyc_service.dto.KycResponseDTO;

import com.fincore.kyc_service.service.KycService;

@RestController
public class KycController {
	
	@Autowired
	private KycService kycService;
	
	@PostMapping("/api/v1/kyc/submit")
	public KycResponseDTO submitKyc (@RequestBody KycRequestDTO request) {
		return kycService.submitKyc(request);
				
	}
	

}
