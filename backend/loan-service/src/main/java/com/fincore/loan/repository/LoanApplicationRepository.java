package com.fincore.loan.repository;

import com.fincore.loan.entity.LoanApplication;
import com.fincore.loan.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long>, JpaSpecificationExecutor<LoanApplication> {

    Optional<LoanApplication> findByApplicationNumber(String applicationNumber);

    List<LoanApplication> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Page<LoanApplication> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    List<LoanApplication> findByStatus(ApplicationStatus status);

    Page<LoanApplication> findByStatusOrderByCreatedAtDesc(ApplicationStatus status, Pageable pageable);

    long countByStatus(ApplicationStatus status);
}
