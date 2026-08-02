package com.fincore.kyc_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fincore.kyc_service.dto.KycRequestDTO;
import com.fincore.kyc_service.dto.KycResponseDTO;
import com.fincore.kyc_service.entity.Kyc;
import com.fincore.kyc_service.repository.KycRepository;

@Service
public class KycServiceImpl implements KycService {
	@Autowired
	private KycRepository kycRepository;

	@Override
	public KycResponseDTO submitKyc(KycRequestDTO request) {
		Kyc kyc=new Kyc();
		KycResponseDTO response = new KycResponseDTO();
		
		kyc.setFirstName(request.getFirstName());
	    kyc.setLastName(request.getLastName());
	    kyc.setDateOfBirth(request.getDateOfBirth());
	    kyc.setGender(request.getGender());
	    kyc.setGovernmentIdType(request.getGovernmentIdType());
	    kyc.setGovernmentIdNumber(request.getGovernmentIdNumber());

	    kyc.setAddressLine1(request.getAddressLine1());
	    kyc.setAddressLine2(request.getAddressLine2());
	    kyc.setCity(request.getCity());
	    kyc.setState(request.getState());
	    kyc.setPostalCode(request.getPostalCode());
	    kyc.setCountry(request.getCountry());

	    kyc.setOccupationStatus(request.getOccupationStatus());
	    kyc.setAnnualIncomeRange(request.getAnnualIncomeRange());
	    kyc.setPepDeclaration(request.isPepDeclaration());
	    
	    kyc.setStatus("PENDING");
	    
	    kycRepository.save(kyc);
	    
	    
	    response.setKycId(kyc.getKycId());
	    response.setStatus(kyc.getStatus());
	    response.setMessage("KYC submitted Successfully");

		
		return response;
		
		
	}

	@Override
	public KycResponseDTO getKycStatus(KycRequestDTO request) {
		
		return null;
	}

	@Override
	public KycResponseDTO approveKyc(KycRequestDTO request) {
		
		return null;
	}

	@Override
	public KycResponseDTO rejectKyc(KycRequestDTO request) {
		
		return null;
	}
	
	
		
	
}

