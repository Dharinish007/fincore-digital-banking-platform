package com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.repo;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.accountEntity;
import com.example.fincoredigitalbankingmanagementplatform2.statementgeneration.entity.transactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface transactionRepo extends JpaRepository<transactionEntity,Long > {
    List<transactionEntity> findTop10BySenderAccountNumberOrderByTransactionDateDesc(accountEntity account);
    List<transactionEntity> findBysenderAccountNumberAndTransactionDateBetween(
            accountEntity account,
            LocalDate startDate,
            LocalDate endDate);
}