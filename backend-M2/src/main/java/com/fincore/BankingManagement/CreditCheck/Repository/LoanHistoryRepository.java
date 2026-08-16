package com.fincore.BankingManagement.CreditCheck.Repository;

import com.fincore.BankingManagement.CreditCheck.entity.LoanHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanHistoryRepository extends JpaRepository<LoanHistory, Long> {
    List<LoanHistory> findByCustomerCustomerIdOrderByStartDateDesc(Long customerId);
}
