package com.fincore.customerservice.repository;

import com.fincore.customerservice.entity.Customer;
import com.fincore.customerservice.enums.CustomerStatus;
import com.fincore.customerservice.enums.KycStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByCustomerNumber(String customerNumber);

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    Page<Customer> findByKycStatus(KycStatus kycStatus, Pageable pageable);

    long countByStatus(CustomerStatus status);

    long countByKycStatus(KycStatus kycStatus);

    Page<Customer> findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCase(
            String lastName, String firstName, Pageable pageable);
}
