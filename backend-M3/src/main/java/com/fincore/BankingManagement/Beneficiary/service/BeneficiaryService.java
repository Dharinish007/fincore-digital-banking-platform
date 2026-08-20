package com.fincore.BankingManagement.Beneficiary.service;

import com.fincore.BankingManagement.Beneficiary.Repository.BeneficiaryRepository;
import com.fincore.BankingManagement.Beneficiary.dto.BeneficiaryResponse;
import com.fincore.BankingManagement.models.beneficiary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeneficiaryService {
    @Autowired
    private BeneficiaryRepository repo;
    public List<BeneficiaryResponse> findAll() {
        return
                repo.findAll()
                        .stream()
                        .map(b->new BeneficiaryResponse (b.getBeneficiary_name(),b.getAccount_no(),
                                b.getIfsc(),b.getBank_name(),b.getBeneficiary_type(),b.getStatus())).toList();
    }
}
