package com.bankingapp.beneficiaryservice.service;

import com.bankingapp.beneficiaryservice.dto.BeneficiaryRequest;
import com.bankingapp.beneficiaryservice.dto.BeneficiaryResponse;

import java.util.List;

public interface BeneficiaryService {

    BeneficiaryResponse createBeneficiary(
            BeneficiaryRequest request);

    BeneficiaryResponse getBeneficiaryById(
            Long id);

    List<BeneficiaryResponse> getBeneficiariesByCustomer(
            Long customerId);

    BeneficiaryResponse updateBeneficiary(
            Long id,
            BeneficiaryRequest request);

    void deleteBeneficiary(Long id);
}