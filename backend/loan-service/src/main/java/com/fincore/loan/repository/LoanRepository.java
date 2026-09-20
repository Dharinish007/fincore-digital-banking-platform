package com.fincore.loan.repository;

import com.fincore.loan.entity.Loan;
import com.fincore.loan.enums.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long>, JpaSpecificationExecutor<Loan> {

    Optional<Loan> findByLoanNumber(String loanNumber);

    Optional<Loan> findByApplicationId(Long applicationId);

    List<Loan> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Page<Loan> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    List<Loan> findByStatus(LoanStatus status);

    Page<Loan> findByStatusOrderByCreatedAtDesc(LoanStatus status, Pageable pageable);

    long countByStatus(LoanStatus status);

    @Query("SELECT COALESCE(SUM(l.principalAmount), 0) FROM Loan l WHERE l.status = 'ACTIVE' OR l.status = 'PAID_OFF'")
    BigDecimal sumDisbursedAmount();

    @Query("SELECT COALESCE(SUM(l.outstandingAmount), 0) FROM Loan l WHERE l.status = 'ACTIVE'")
    BigDecimal sumActiveOutstandingAmount();
}
