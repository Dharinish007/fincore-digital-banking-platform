package com.fincore.customerservice.controller;

import com.fincore.customerservice.dto.*;
import com.fincore.customerservice.enums.KycStatus;
import com.fincore.customerservice.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Customer created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Long id) {
        CustomerResponse response = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Customer retrieved successfully"));
    }

    @GetMapping("/number/{customerNumber}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerByNumber(
            @PathVariable String customerNumber) {
        CustomerResponse response = customerService.getCustomerByNumber(customerNumber);
        return ResponseEntity.ok(ApiResponse.success(response, "Customer retrieved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CustomerResponse>>> getAllCustomers(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        Page<CustomerResponse> response = customerService.getAllCustomers(pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Customers retrieved successfully"));
    }

    @GetMapping("/kyc-status/{kycStatus}")
    public ResponseEntity<ApiResponse<Page<CustomerResponse>>> getCustomersByKycStatus(
            @PathVariable KycStatus kycStatus,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        Page<CustomerResponse> response = customerService.getCustomersByKycStatus(kycStatus, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Customers retrieved successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<CustomerResponse>>> searchCustomers(
            @RequestParam String name,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        Page<CustomerResponse> response = customerService.searchCustomersByName(name, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Search results retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable Long id, @Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Customer updated successfully"));
    }

    @PatchMapping("/{id}/kyc-status")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateKycStatus(
            @PathVariable Long id, @Valid @RequestBody KycStatusUpdateRequest request) {
        CustomerResponse response = customerService.updateKycStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "KYC status updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Customer deleted successfully"));
    }
}
