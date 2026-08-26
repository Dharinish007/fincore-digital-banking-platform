package com.fincore.BankingManagement.Account.Repository;

import java.util.List;

import com.fincore.BankingManagement.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    List<Account> findByCustomerId(Long customerId);
}
