package com.fincore.loan.controller;

import com.fincore.loan.dto.ApiResponse;
import com.fincore.loan.dto.LoanProductRequest;
import com.fincore.loan.dto.LoanProductResponse;
import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanType;
import com.fincore.loan.service.LoanProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loan-products")
@RequiredArgsConstructor
@Validated
public class LoanProductController {

    private final LoanProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<LoanProductResponse>> createProduct(
            @Valid @RequestBody LoanProductRequest request) {
        LoanProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Loan product created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanProductResponse>> getProductById(@PathVariable Long id) {
        LoanProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan product retrieved successfully"));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<LoanProductResponse>> getProductByCode(@PathVariable String code) {
        LoanProductResponse response = productService.getProductByCode(code);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan product retrieved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoanProductResponse>>> getAllProducts(
            @RequestParam(required = false) LoanProductStatus status,
            @RequestParam(required = false) LoanType type) {
        List<LoanProductResponse> response = productService.getAllProducts(status, type);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan products retrieved successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LoanProductResponse>> updateProductStatus(
            @PathVariable Long id,
            @RequestParam LoanProductStatus status) {
        LoanProductResponse response = productService.updateProductStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan product status updated successfully"));
    }
}
