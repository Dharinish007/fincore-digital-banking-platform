package com.fincore.loan.service;

import com.fincore.loan.dto.LoanProductRequest;
import com.fincore.loan.dto.LoanProductResponse;
import com.fincore.loan.entity.LoanProduct;
import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanType;
import com.fincore.loan.exception.ResourceNotFoundException;
import com.fincore.loan.repository.LoanProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanProductServiceImpl implements LoanProductService {

    private final LoanProductRepository productRepository;

    @Override
    @Transactional
    public LoanProductResponse createProduct(LoanProductRequest request) {
        com.fincore.loan.security.UserContext authUser = com.fincore.loan.security.UserContextHolder.getContext();
        if (authUser == null || !authUser.isAdmin()) {
            log.warn("Non-admin user attempted to create loan product: {}", authUser != null ? authUser.getRole() : "UNAUTHENTICATED");
            throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: Only ADMIN can create loan products");
        }

        log.info("Creating new loan product: {}", request.getName());

        if (productRepository.findByProductCode(request.getProductCode().trim()).isPresent()) {
            throw new IllegalArgumentException("Loan product code already exists: " + request.getProductCode());
        }

        if (request.getMinAmount().compareTo(request.getMaxAmount()) > 0) {
            throw new IllegalArgumentException("Minimum amount cannot be greater than maximum amount");
        }

        if (request.getMinTenureMonths() > request.getMaxTenureMonths()) {
            throw new IllegalArgumentException("Minimum tenure cannot be greater than maximum tenure");
        }

        LoanProduct product = LoanProduct.builder()
                .productCode(request.getProductCode().trim().toUpperCase())
                .name(request.getName().trim())
                .loanType(request.getLoanType())
                .minAmount(request.getMinAmount())
                .maxAmount(request.getMaxAmount())
                .interestRate(request.getInterestRate())
                .minTenureMonths(request.getMinTenureMonths())
                .maxTenureMonths(request.getMaxTenureMonths())
                .processingFeePercentage(request.getProcessingFeePercentage() != null ? request.getProcessingFeePercentage() : java.math.BigDecimal.ZERO)
                .status(request.getStatus() != null ? request.getStatus() : LoanProductStatus.ACTIVE)
                .description(request.getDescription())
                .build();

        return LoanProductResponse.from(productRepository.save(product));
    }

    @Override
    @Transactional(readOnly = true)
    public LoanProductResponse getProductById(Long id) {
        LoanProduct product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan product not found with ID: " + id));
        return LoanProductResponse.from(product);
    }

    @Override
    @Transactional(readOnly = true)
    public LoanProductResponse getProductByCode(String code) {
        LoanProduct product = productRepository.findByProductCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Loan product not found with code: " + code));
        return LoanProductResponse.from(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoanProductResponse> getAllProducts(LoanProductStatus status, LoanType loanType) {
        com.fincore.loan.security.UserContext authUser = com.fincore.loan.security.UserContextHolder.getContext();
        LoanProductStatus effectiveStatus = status;
        if (authUser != null && authUser.isCustomer()) {
            effectiveStatus = LoanProductStatus.ACTIVE;
        }

        List<LoanProduct> products;
        if (effectiveStatus != null && loanType != null) {
            products = productRepository.findByStatusAndLoanType(effectiveStatus, loanType);
        } else if (effectiveStatus != null) {
            products = productRepository.findByStatus(effectiveStatus);
        } else if (loanType != null) {
            products = productRepository.findByLoanType(loanType);
        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(LoanProductResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LoanProductResponse updateProductStatus(Long id, LoanProductStatus status) {
        com.fincore.loan.security.UserContext authUser = com.fincore.loan.security.UserContextHolder.getContext();
        if (authUser == null || !authUser.isAdmin()) {
            log.warn("Non-admin user attempted to update loan product status: {}", authUser != null ? authUser.getRole() : "UNAUTHENTICATED");
            throw new com.fincore.loan.exception.LoanOwnershipViolationException("Access denied: Only ADMIN can update loan product status");
        }

        LoanProduct product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan product not found with ID: " + id));
        product.setStatus(status);
        return LoanProductResponse.from(productRepository.save(product));
    }
}
