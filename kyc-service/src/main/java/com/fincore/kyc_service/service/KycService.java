package com.fincore.kyc_service.service;

import java.util.List;

import com.fincore.kyc_service.dto.KycRequestDTO;
import com.fincore.kyc_service.dto.KycResponseDTO;

public interface KycService {

    List<KycResponseDTO> getAllKyc();

    KycResponseDTO submitKyc(KycRequestDTO request);

    KycResponseDTO getKycStatus(Long kycId);

    KycResponseDTO approveKyc(KycRequestDTO request);

    KycResponseDTO rejectKyc(KycRequestDTO request);

}