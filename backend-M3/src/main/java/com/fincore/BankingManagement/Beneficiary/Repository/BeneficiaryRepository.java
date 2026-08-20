package com.fincore.BankingManagement.Beneficiary.Repository;

import com.fincore.BankingManagement.models.beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BeneficiaryRepository extends JpaRepository<beneficiary,Integer> {
}
