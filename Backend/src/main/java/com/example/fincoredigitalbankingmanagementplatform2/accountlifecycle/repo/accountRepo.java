package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.repo;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.accountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface accountRepo extends JpaRepository<accountEntity,Long> {
    long countByStatus(String status);
    Optional<accountEntity> findByAccountNumber(String accountNumber);
    Optional<accountEntity> findByAccountIdAndCustomerId(
            String accountNumber,
            Long customerId
    );
}
