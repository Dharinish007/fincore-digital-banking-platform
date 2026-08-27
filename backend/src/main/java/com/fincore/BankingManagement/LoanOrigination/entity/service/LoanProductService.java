package com.fincore.BankingManagement.LoanOrigination.entity.service;
import com.fincore.BankingManagement.LoanOrigination.entity.LoanType;
import com.fincore.BankingManagement.LoanOrigination.entity.dto.LoanApplicationRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class LoanProductService {
    public LoanProductService() {
        LoanApplicationRequest request=new LoanApplicationRequest();
        System.out.println(request.getCustomerName());
    }

    public BigDecimal getInterestRate(LoanType loanType) {

        return switch (loanType) {

            case Home->
                    BigDecimal.valueOf(8.50);

            case Personal ->
                    BigDecimal.valueOf(10.50);

            case Vehicle->
                    BigDecimal.valueOf(9.50);

            case Education ->
                    BigDecimal.valueOf(7.50);

            case Gold->
                    BigDecimal.valueOf(9.00);

            case Other->
                    BigDecimal.valueOf(11.00);
        };
    }
}