package com.fincore.BankingManagement.Milestone3.fraudcheck.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fincore.BankingManagement.Milestone3.fraudcheck.enums.FraudStatus;
import com.fincore.BankingManagement.Milestone3.fraudcheck.models.FraudCheck;

@Repository
public interface FraudCheckRepository
        extends JpaRepository<FraudCheck, Long> {

    @Query("SELECT f FROM FraudCheck f WHERE f.payment_id = :paymentId")
    Optional<FraudCheck> findByPaymentId(
            @Param("paymentId") Long paymentId
    );

    @Query("SELECT f FROM FraudCheck f WHERE f.fraud_status = :status")
    List<FraudCheck> findByFraudStatus(
            @Param("status") FraudStatus status
    );
}