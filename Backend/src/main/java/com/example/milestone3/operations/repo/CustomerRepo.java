package com.example.milestone3.operations.repo;

import com.example.milestone3.operations.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerRepo extends JpaRepository<Customer, Long> {
    List<Customer> findAllByOrderByIdAsc();
    List<Customer> findAllByOrderByIdDesc();
}
