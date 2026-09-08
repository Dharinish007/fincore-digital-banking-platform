package com.example.milestone3.operations.repo;

import com.example.milestone3.operations.entity.AccountStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountStatementRepo extends JpaRepository<AccountStatement, Long> {
    List<AccountStatement> findByAccountIdOrderByCreatedAtDesc(Long accountId);
}
