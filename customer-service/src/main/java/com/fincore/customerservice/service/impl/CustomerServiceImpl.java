package com.fincore.customerservice.service.impl;

import com.fincore.customerservice.dto.CustomerMapper;
import com.fincore.customerservice.dto.CustomerRequest;
import com.fincore.customerservice.dto.CustomerResponse;
import com.fincore.customerservice.dto.KycStatusUpdateRequest;
import com.fincore.customerservice.entity.Customer;
import com.fincore.customerservice.enums.KycStatus;
import com.fincore.customerservice.exception.DuplicateResourceException;
import com.fincore.customerservice.exception.ResourceNotFoundException;
import com.fincore.customerservice.repository.CustomerRepository;
import com.fincore.customerservice.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public CustomerResponse createCustomer(CustomerRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("A customer with email '" + request.getEmail() + "' already exists");
        }

        Customer customer = customerMapper.toEntity(request);
        customer.setCustomerNumber(generateCustomerNumber());

        Customer saved = customerRepository.save(customer);
        log.info("Created customer with id={}, customerNumber={}", saved.getId(), saved.getCustomerNumber());

        return customerMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = findCustomerOrThrow(id);
        return customerMapper.toResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerByNumber(String customerNumber) {
        Customer customer = customerRepository.findByCustomerNumber(customerNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found with customerNumber: " + customerNumber));
        return customerMapper.toResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable).map(customerMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> getCustomersByKycStatus(KycStatus kycStatus, Pageable pageable) {
        return customerRepository.findByKycStatus(kycStatus, pageable).map(customerMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> searchCustomersByName(String name, Pageable pageable) {
        return customerRepository
                .findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCase(name, name, pageable)
                .map(customerMapper::toResponse);
    }

    @Override
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = findCustomerOrThrow(id);

        // If email is changing, make sure the new one isn't already taken by someone else
        if (!customer.getEmail().equalsIgnoreCase(request.getEmail())
                && customerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("A customer with email '" + request.getEmail() + "' already exists");
        }

        customerMapper.updateEntityFromRequest(request, customer);
        Customer updated = customerRepository.save(customer);
        log.info("Updated customer id={}", id);

        return customerMapper.toResponse(updated);
    }

    @Override
    public CustomerResponse updateKycStatus(Long id, KycStatusUpdateRequest request) {
        Customer customer = findCustomerOrThrow(id);
        customer.setKycStatus(request.getKycStatus());
        Customer updated = customerRepository.save(customer);
        log.info("Updated KYC status for customer id={} to {}", id, request.getKycStatus());

        return customerMapper.toResponse(updated);
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = findCustomerOrThrow(id);
        customerRepository.delete(customer);
        log.info("Deleted customer id={}", id);
    }

    private Customer findCustomerOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    private String generateCustomerNumber() {
        return "CUST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
