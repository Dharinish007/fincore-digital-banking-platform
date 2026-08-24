package com.fincore.BankingManagement.Beneficiary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fincore.BankingManagement.Beneficiary.Repository.BeneficiaryRepository;
import com.fincore.BankingManagement.Beneficiary.dto.BeneficiaryRequest;
import com.fincore.BankingManagement.Beneficiary.dto.BeneficiaryResponse;
import com.fincore.BankingManagement.Beneficiary.dto.GetByBeneficiaryIdResponse;
import com.fincore.BankingManagement.models.beneficiary;

@Service
public class BeneficiaryService {
    @Autowired
    private BeneficiaryRepository repo;
    public List<BeneficiaryResponse> findAll() {
        return
                repo.findAll()
                        .stream()
                        .map(b->new BeneficiaryResponse (b.getBeneficiary_id(),b.getBeneficiary_name(),b.getAccount_no(),
                                b.getIfsc(),b.getBank_name(),b.getBeneficiary_type(),b.getStatus())).toList();
    }
    public GetByBeneficiaryIdResponse findById(long id){

        beneficiary beneficiary=repo.findById(id).orElse(null);
        if(beneficiary==null){
            return null;
        }

        GetByBeneficiaryIdResponse Response=new GetByBeneficiaryIdResponse(beneficiary.getAccount_no(),beneficiary.getStatus(),beneficiary.getBeneficiary_name(),
                beneficiary.getIfsc(),beneficiary.getBeneficiary_type(),beneficiary.getBeneficiary_id(),beneficiary.getBank_name());
        return Response;
    }

    public BeneficiaryResponse updateDetails(BeneficiaryRequest request) {

        beneficiary beneficiary =
                repo.findById(request.getBeneficiary_id()).orElse(null);

        if (beneficiary == null) {
            return null;
        }

        beneficiary.setBeneficiary_name(request.getName());
        beneficiary.setBeneficiary_type(request.getBeneficiary_type());
        beneficiary.setIfsc(request.getIfsc());
        beneficiary.setStatus(request.getStatus());
        beneficiary.setAccount_no(request.getAccountNumber());
        beneficiary.setBank_name(request.getBank());
        repo.save(beneficiary);

        return new BeneficiaryResponse(
        request.getBeneficiary_id(),
        request.getName(),
        request.getAccountNumber(),
        request.getIfsc(),
        request.getBank(),
        request.getBeneficiary_type(),
        request.getStatus()
        );
    }
}
