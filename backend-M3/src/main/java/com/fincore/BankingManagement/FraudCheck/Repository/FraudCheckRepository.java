package com.fincore.BankingManagement.FraudCheck.Repository;

import com.fincore.BankingManagement.models.FraudCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FraudCheckRepository extends JpaRepository<FraudCheck, Long> {

    Optional<FraudCheck> findByPayment_id(Long paymentId);
}