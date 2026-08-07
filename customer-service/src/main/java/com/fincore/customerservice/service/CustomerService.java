package com.fincore.customerservice.service;

import com.fincore.customerservice.dto.CustomerRequest;
import com.fincore.customerservice.dto.CustomerResponse;
import com.fincore.customerservice.dto.KycStatusUpdateRequest;
import com.fincore.customerservice.enums.KycStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {

    CustomerResponse createCustomer(CustomerRequest request);

    CustomerResponse getCustomerById(Long id);

    CustomerResponse getCustomerByNumber(String customerNumber);

    Page<CustomerResponse> getAllCustomers(Pageable pageable);

    Page<CustomerResponse> getCustomersByKycStatus(KycStatus kycStatus, Pageable pageable);

    Page<CustomerResponse> searchCustomersByName(String name, Pageable pageable);

    CustomerResponse updateCustomer(Long id, CustomerRequest request);

    CustomerResponse updateKycStatus(Long id, KycStatusUpdateRequest request);

    void deleteCustomer(Long id);
}
