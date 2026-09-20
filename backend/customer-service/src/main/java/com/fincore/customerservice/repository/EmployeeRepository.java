package com.fincore.customerservice.repository;

import com.fincore.customerservice.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmployeeNumber(String employeeNumber);

    Optional<Employee> findByEmailIgnoreCase(String email);

    boolean existsByEmployeeNumber(String employeeNumber);

    boolean existsByEmailIgnoreCase(String email);
}
