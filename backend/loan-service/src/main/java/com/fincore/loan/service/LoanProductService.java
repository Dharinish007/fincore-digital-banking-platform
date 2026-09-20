package com.fincore.loan.service;

import com.fincore.loan.dto.LoanProductRequest;
import com.fincore.loan.dto.LoanProductResponse;
import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanType;

import java.util.List;

public interface LoanProductService {

    LoanProductResponse createProduct(LoanProductRequest request);

    LoanProductResponse getProductById(Long id);

    LoanProductResponse getProductByCode(String code);

    List<LoanProductResponse> getAllProducts(LoanProductStatus status, LoanType loanType);

    LoanProductResponse updateProductStatus(Long id, LoanProductStatus status);
}
