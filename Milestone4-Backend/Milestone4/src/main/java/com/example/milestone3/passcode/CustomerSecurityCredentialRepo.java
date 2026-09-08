package com.example.milestone3.passcode;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerSecurityCredentialRepo extends JpaRepository<CustomerSecurityCredential, Long> {
    Optional<CustomerSecurityCredential> findByCustomerId(Long customerId);
}
