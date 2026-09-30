package com.fincore.controller;

import com.fincore.dto.ApiResponse;
import com.fincore.entity.Customer;
import com.fincore.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/core/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        return ResponseEntity.ok(ApiResponse.ok("Customers retrieved", customerRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable String id) {
        return customerRepository.findById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.ok("Customer found", c)))
                .orElse(ResponseEntity.badRequest().body(ApiResponse.error("Customer not found")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@RequestBody Customer customer) {
        if (customer.getCustomerCode() == null || customer.getCustomerCode().isEmpty()) {
            customer.setCustomerCode("CUST-" + System.currentTimeMillis() % 1000000);
        }
        Customer saved = customerRepository.save(customer);
        return ResponseEntity.ok(ApiResponse.ok("Customer onboarded successfully", saved));
    }
}
