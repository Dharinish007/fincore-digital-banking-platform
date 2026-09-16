package com.fincore.BankingManagement.Milestone3.beneficiaryverification.Repository;

import com.fincore.BankingManagement.Milestone3.beneficiaryverification.models.beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BeneficiaryRepository extends JpaRepository<beneficiary,Long> {
}
