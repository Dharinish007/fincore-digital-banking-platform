package com.fincore.kyc_service.service;

import com.fincore.kyc_service.dto.KycRequestDTO;
import com.fincore.kyc_service.dto.KycResponseDTO;

public interface KycService {

    KycResponseDTO submitKyc(KycRequestDTO request);

    KycResponseDTO getKycStatus(Long kycId);

    KycResponseDTO approveKyc(KycRequestDTO request);

    KycResponseDTO rejectKyc(KycRequestDTO request);

}