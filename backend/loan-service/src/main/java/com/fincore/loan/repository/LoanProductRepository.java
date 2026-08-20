package com.fincore.loan.repository;

import com.fincore.loan.entity.LoanProduct;
import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanProductRepository extends JpaRepository<LoanProduct, Long> {

    Optional<LoanProduct> findByProductCode(String productCode);

    List<LoanProduct> findByStatus(LoanProductStatus status);

    List<LoanProduct> findByLoanType(LoanType loanType);

    List<LoanProduct> findByStatusAndLoanType(LoanProductStatus status, LoanType loanType);
}
