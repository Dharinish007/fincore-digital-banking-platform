package com.bankingapp.beneficiaryservice.service;

import com.bankingapp.beneficiaryservice.dto.BeneficiaryRequest;
import com.bankingapp.beneficiaryservice.dto.BeneficiaryResponse;
import com.bankingapp.beneficiaryservice.entity.Beneficiary;
import com.bankingapp.beneficiaryservice.enums.BeneficiaryStatus;
import com.bankingapp.beneficiaryservice.exception.BeneficiaryNotFoundException;
import com.bankingapp.beneficiaryservice.repository.BeneficiaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;

    public BeneficiaryServiceImpl(
            BeneficiaryRepository beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }

    @Override
    public BeneficiaryResponse createBeneficiary(
            BeneficiaryRequest request) {

        Beneficiary beneficiary = new Beneficiary();

        beneficiary.setCustomerId(
                request.getCustomerId());

        beneficiary.setBeneficiaryName(
                request.getBeneficiaryName());

        beneficiary.setAccountNumber(
                request.getAccountNumber());

        beneficiary.setIfscCode(
                request.getIfscCode());

        beneficiary.setBankName(
                request.getBankName());

        beneficiary.setStatus(
                BeneficiaryStatus.ACTIVE);

        Beneficiary saved =
                beneficiaryRepository.save(beneficiary);

        return convertToResponse(saved);
    }

    @Override
    public BeneficiaryResponse getBeneficiaryById(
            Long id) {

        Beneficiary beneficiary =
                beneficiaryRepository.findById(id)
                        .orElseThrow(() ->
                                new BeneficiaryNotFoundException(
                                        "Beneficiary not found with ID: "
                                                + id));

        return convertToResponse(beneficiary);
    }

    @Override
    public List<BeneficiaryResponse>
    getBeneficiariesByCustomer(Long customerId) {

        return beneficiaryRepository
                .findByCustomerId(customerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public BeneficiaryResponse updateBeneficiary(
            Long id,
            BeneficiaryRequest request) {

        Beneficiary beneficiary =
                beneficiaryRepository.findById(id)
                        .orElseThrow(() ->
                                new BeneficiaryNotFoundException(
                                        "Beneficiary not found with ID: "
                                                + id));

        beneficiary.setCustomerId(
                request.getCustomerId());

        beneficiary.setBeneficiaryName(
                request.getBeneficiaryName());

        beneficiary.setAccountNumber(
                request.getAccountNumber());

        beneficiary.setIfscCode(
                request.getIfscCode());

        beneficiary.setBankName(
                request.getBankName());

        Beneficiary updated =
                beneficiaryRepository.save(beneficiary);

        return convertToResponse(updated);
    }

    @Override
    public void deleteBeneficiary(Long id) {

        Beneficiary beneficiary =
                beneficiaryRepository.findById(id)
                        .orElseThrow(() ->
                                new BeneficiaryNotFoundException(
                                        "Beneficiary not found with ID: "
                                                + id));

        beneficiaryRepository.delete(beneficiary);
    }

    private BeneficiaryResponse convertToResponse(
            Beneficiary beneficiary) {

        BeneficiaryResponse response =
                new BeneficiaryResponse();

        response.setBeneficiaryId(
                beneficiary.getBeneficiaryId());

        response.setCustomerId(
                beneficiary.getCustomerId());

        response.setBeneficiaryName(
                beneficiary.getBeneficiaryName());

        response.setAccountNumber(
                beneficiary.getAccountNumber());

        response.setIfscCode(
                beneficiary.getIfscCode());

        response.setBankName(
                beneficiary.getBankName());

        response.setStatus(
                beneficiary.getStatus());

        return response;
    }
}