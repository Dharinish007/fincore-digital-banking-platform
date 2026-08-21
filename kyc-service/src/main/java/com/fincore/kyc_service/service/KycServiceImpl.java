package com.fincore.kyc_service.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fincore.kyc_service.config.NotificationClient;
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

    @Autowired
    private NotificationClient notificationClient;

    @Override
    public List<KycResponseDTO> getAllKyc() {

        List<Kyc> kycList = kycRepository.findAll();

        List<KycResponseDTO> responseList = new ArrayList<>();

        for (Kyc kyc : kycList) {

            KycResponseDTO response = new KycResponseDTO();

            response.setKycId(kyc.getKycId());
            response.setFirstName(kyc.getFirstName());
            response.setLastName(kyc.getLastName());
            response.setEmail(kyc.getEmail());
            response.setGovernmentIdType(kyc.getGovernmentIdType());
            response.setGovernmentIdNumber(kyc.getGovernmentIdNumber());
            response.setCity(kyc.getCity());
            response.setStatus(kyc.getStatus());
            response.setMessage("KYC record fetched");

            responseList.add(response);
        }

        return responseList;
    }

    @Override
    public KycResponseDTO submitKyc(KycRequestDTO request) {

        Kyc kyc = new Kyc();

        // Personal Details
        kyc.setFirstName(request.getFirstName());
        kyc.setLastName(request.getLastName());
        kyc.setDateOfBirth(request.getDateOfBirth());
        kyc.setGender(request.getGender());

        // Identity Details
        kyc.setGovernmentIdType(request.getGovernmentIdType());
        kyc.setGovernmentIdNumber(request.getGovernmentIdNumber());

        // Address Details
        kyc.setAddressLine1(request.getAddressLine1());
        kyc.setAddressLine2(request.getAddressLine2());
        kyc.setCity(request.getCity());
        kyc.setState(request.getState());
        kyc.setPostalCode(request.getPostalCode());
        kyc.setCountry(request.getCountry());

        // Financial Details
        kyc.setOccupationStatus(request.getOccupationStatus());
        kyc.setAnnualIncomeRange(request.getAnnualIncomeRange());

        // Declaration
        kyc.setPepDeclaration(request.isPepDeclaration());

        // Email
        kyc.setEmail(request.getEmail());

        // Default Status
        kyc.setStatus("PENDING");

        Kyc savedKyc = kycRepository.save(kyc);

        notificationClient.notify(
                savedKyc.getEmail(),
                "KYC_SUBMITTED",
                "Your KYC application has been submitted and is pending review."
        );

        KycResponseDTO response = new KycResponseDTO();
        response.setKycId(savedKyc.getKycId());
        response.setStatus(savedKyc.getStatus());
        response.setMessage("KYC submitted successfully");

        return response;
    }

    @Override
    public KycResponseDTO getKycStatus(Long kycId) {

        Kyc kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new RuntimeException("KYC not found"));

        KycResponseDTO response = new KycResponseDTO();
        response.setKycId(kyc.getKycId());
        response.setStatus(kyc.getStatus());
        response.setMessage("KYC status fetched successfully");

        return response;
    }

    @Override
    public KycResponseDTO approveKyc(KycRequestDTO request) {

        KycResponseDTO response = new KycResponseDTO();

        Optional<Kyc> optionalKyc = kycRepository.findById(request.getKycId());

        if (optionalKyc.isPresent()) {

            Kyc kyc = optionalKyc.get();

            kyc.setStatus("APPROVED");

            kycRepository.save(kyc);

            notificationClient.notify(
                    kyc.getEmail(),
                    "KYC_APPROVED",
                    "Your KYC has been approved."
            );

            response.setKycId(kyc.getKycId());
            response.setStatus(kyc.getStatus());
            response.setMessage("KYC approved successfully");

        } else {

            response.setMessage("KYC not found");
        }

        return response;
    }

    @Override
    public KycResponseDTO rejectKyc(KycRequestDTO request) {

        KycResponseDTO response = new KycResponseDTO();

        Optional<Kyc> optionalKyc = kycRepository.findById(request.getKycId());

        if (optionalKyc.isPresent()) {

            Kyc kyc = optionalKyc.get();

            kyc.setStatus("REJECTED");

            kycRepository.save(kyc);

            notificationClient.notify(
                    kyc.getEmail(),
                    "KYC_REJECTED",
                    "Your KYC has been rejected. Please contact support for details."
            );

            response.setKycId(kyc.getKycId());
            response.setStatus(kyc.getStatus());
            response.setMessage("KYC rejected successfully");

        } else {

            response.setMessage("KYC not found");
        }

        return response;
    }

    private KycResponseDTO updateStatus(Long kycId, String status) {

        Kyc kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new RuntimeException("KYC not found"));

        kyc.setStatus(status);

        Kyc updatedKyc = kycRepository.save(kyc);

        KycResponseDTO response = new KycResponseDTO();
        response.setKycId(updatedKyc.getKycId());
        response.setStatus(updatedKyc.getStatus());
        response.setMessage("KYC status updated successfully");

        return response;
    }
}