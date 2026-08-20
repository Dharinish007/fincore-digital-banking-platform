package com.fincore.loan.service;

import com.fincore.loan.dto.LoanProductRequest;
import com.fincore.loan.dto.LoanProductResponse;
import com.fincore.loan.entity.LoanProduct;
import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanType;
import com.fincore.loan.exception.LoanOwnershipViolationException;
import com.fincore.loan.repository.LoanProductRepository;
import com.fincore.loan.security.UserContext;
import com.fincore.loan.security.UserContextHolder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanProductServiceTest {

    @Mock
    private LoanProductRepository productRepository;

    private LoanProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        UserContextHolder.clear();
        productService = new LoanProductServiceImpl(productRepository);
    }

    @AfterEach
    void tearDown() {
        UserContextHolder.clear();
    }

    @Test
    @DisplayName("Admin should successfully create loan product")
    void testAdminCreateProduct_Success() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(1L)
                .username("admin")
                .role("ADMIN")
                .build());

        LoanProductRequest request = LoanProductRequest.builder()
                .productCode("HOME_01")
                .name("Home Loan Standard")
                .loanType(LoanType.HOME)
                .minAmount(new BigDecimal("10000.00"))
                .maxAmount(new BigDecimal("500000.00"))
                .interestRate(new BigDecimal("6.50"))
                .minTenureMonths(12)
                .maxTenureMonths(360)
                .status(LoanProductStatus.ACTIVE)
                .build();

        when(productRepository.findByProductCode("HOME_01")).thenReturn(Optional.empty());
        when(productRepository.save(any(LoanProduct.class))).thenAnswer(invocation -> {
            LoanProduct p = invocation.getArgument(0);
            p.setId(10L);
            return p;
        });

        LoanProductResponse response = productService.createProduct(request);

        assertNotNull(response);
        assertEquals("HOME_01", response.getProductCode());
        assertEquals("Home Loan Standard", response.getName());
        verify(productRepository).save(any(LoanProduct.class));
    }

    @Test
    @DisplayName("Customer attempting to create loan product should throw LoanOwnershipViolationException")
    void testCustomerCreateProduct_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(9L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        LoanProductRequest request = LoanProductRequest.builder()
                .productCode("AUTO_01")
                .name("Auto Loan")
                .loanType(LoanType.AUTO)
                .minAmount(new BigDecimal("5000.00"))
                .maxAmount(new BigDecimal("50000.00"))
                .interestRate(new BigDecimal("7.50"))
                .minTenureMonths(12)
                .maxTenureMonths(60)
                .build();

        assertThrows(LoanOwnershipViolationException.class, () ->
                productService.createProduct(request));
        verifyNoInteractions(productRepository);
    }

    @Test
    @DisplayName("Employee attempting to create loan product should throw LoanOwnershipViolationException")
    void testEmployeeCreateProduct_ThrowsOwnershipViolation() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(2L)
                .username("employee")
                .role("EMPLOYEE")
                .employeeId(1L)
                .build());

        LoanProductRequest request = LoanProductRequest.builder()
                .productCode("AUTO_01")
                .name("Auto Loan")
                .loanType(LoanType.AUTO)
                .minAmount(new BigDecimal("5000.00"))
                .maxAmount(new BigDecimal("50000.00"))
                .interestRate(new BigDecimal("7.50"))
                .minTenureMonths(12)
                .maxTenureMonths(60)
                .build();

        assertThrows(LoanOwnershipViolationException.class, () ->
                productService.createProduct(request));
        verifyNoInteractions(productRepository);
    }

    @Test
    @DisplayName("Admin should successfully update loan product status")
    void testAdminUpdateProductStatus_Success() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(1L)
                .username("admin")
                .role("ADMIN")
                .build());

        LoanProduct product = LoanProduct.builder()
                .id(1L)
                .productCode("PERSONAL_01")
                .name("Personal Loan")
                .loanType(LoanType.PERSONAL)
                .status(LoanProductStatus.ACTIVE)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(LoanProduct.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LoanProductResponse response = productService.updateProductStatus(1L, LoanProductStatus.INACTIVE);

        assertNotNull(response);
        assertEquals(LoanProductStatus.INACTIVE, response.getStatus());
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("Customer should only receive ACTIVE loan products when listing products")
    void testCustomerGetAllProducts_OnlyActiveProducts() {
        UserContextHolder.setContext(UserContext.builder()
                .userId(9L)
                .username("customer")
                .role("CUSTOMER")
                .customerId(9L)
                .build());

        LoanProduct activeProd = LoanProduct.builder()
                .id(1L)
                .productCode("ACT_01")
                .name("Active Product")
                .loanType(LoanType.PERSONAL)
                .status(LoanProductStatus.ACTIVE)
                .build();

        when(productRepository.findByStatus(LoanProductStatus.ACTIVE)).thenReturn(List.of(activeProd));

        List<LoanProductResponse> result = productService.getAllProducts(null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(LoanProductStatus.ACTIVE, result.get(0).getStatus());
        verify(productRepository).findByStatus(LoanProductStatus.ACTIVE);
    }
}
