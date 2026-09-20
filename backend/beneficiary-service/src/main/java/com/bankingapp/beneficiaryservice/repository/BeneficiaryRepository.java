package com.bankingapp.beneficiaryservice.repository;

import com.bankingapp.beneficiaryservice.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BeneficiaryRepository
        extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByCustomerId(Long customerId);
}