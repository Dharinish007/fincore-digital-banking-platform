package com.fincore.BankingManagement.FraudCheck.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fincore.BankingManagement.FraudCheck.Repository.FraudCheckRepository;
import com.fincore.BankingManagement.FraudCheck.models.FraudCheck;

@Service
public class FraudCheckService {

    private final FraudCheckRepository fraudCheckRepository;

    public FraudCheckService(FraudCheckRepository fraudCheckRepository) {
        this.fraudCheckRepository = fraudCheckRepository;
    }

    public FraudCheck saveFraudCheck(FraudCheck fraudCheck) {
        return fraudCheckRepository.save(fraudCheck);
    }

    public Optional<FraudCheck> getFraudCheckByPaymentId(Long paymentId) {
        return fraudCheckRepository.findByPaymentId(paymentId);
    }
}