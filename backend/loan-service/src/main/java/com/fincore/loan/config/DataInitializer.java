package com.fincore.loan.config;

import com.fincore.loan.entity.LoanProduct;
import com.fincore.loan.enums.LoanProductStatus;
import com.fincore.loan.enums.LoanType;
import com.fincore.loan.repository.LoanProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final LoanProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            log.info("Seeding default standard banking loan products into loan-service database...");

            List<LoanProduct> defaultProducts = List.of(
                    LoanProduct.builder()
                            .productCode("PRIME_PERSONAL_01")
                            .name("Personal Growth Loan")
                            .loanType(LoanType.PERSONAL)
                            .minAmount(new BigDecimal("1000.00"))
                            .maxAmount(new BigDecimal("50000.00"))
                            .interestRate(new BigDecimal("8.99"))
                            .minTenureMonths(6)
                            .maxTenureMonths(60)
                            .processingFeePercentage(new BigDecimal("1.00"))
                            .status(LoanProductStatus.ACTIVE)
                            .description("Flexible unsecured personal financing for lifestyle, debt consolidation, or emergency needs.")
                            .build(),

                    LoanProduct.builder()
                            .productCode("HOME_MORTGAGE_01")
                            .name("Home Mortgage Prime")
                            .loanType(LoanType.HOME)
                            .minAmount(new BigDecimal("50000.00"))
                            .maxAmount(new BigDecimal("1000000.00"))
                            .interestRate(new BigDecimal("5.49"))
                            .minTenureMonths(60)
                            .maxTenureMonths(360)
                            .processingFeePercentage(new BigDecimal("0.50"))
                            .status(LoanProductStatus.ACTIVE)
                            .description("Competitive residential mortgage with fixed low rates and long-term repayment terms.")
                            .build(),

                    LoanProduct.builder()
                            .productCode("AUTO_DRIVE_01")
                            .name("Auto Advantage Loan")
                            .loanType(LoanType.AUTO)
                            .minAmount(new BigDecimal("5000.00"))
                            .maxAmount(new BigDecimal("100000.00"))
                            .interestRate(new BigDecimal("6.25"))
                            .minTenureMonths(12)
                            .maxTenureMonths(84)
                            .processingFeePercentage(new BigDecimal("0.75"))
                            .status(LoanProductStatus.ACTIVE)
                            .description("Financing for new and certified pre-owned vehicles with streamlined approval.")
                            .build(),

                    LoanProduct.builder()
                            .productCode("BIZ_GROWTH_01")
                            .name("SME Business Expansion Loan")
                            .loanType(LoanType.BUSINESS)
                            .minAmount(new BigDecimal("20000.00"))
                            .maxAmount(new BigDecimal("500000.00"))
                            .interestRate(new BigDecimal("9.50"))
                            .minTenureMonths(12)
                            .maxTenureMonths(120)
                            .processingFeePercentage(new BigDecimal("1.50"))
                            .status(LoanProductStatus.ACTIVE)
                            .description("Working capital and equipment financing designed to scale small and medium enterprises.")
                            .build(),

                    LoanProduct.builder()
                            .productCode("EDU_SCHOLAR_01")
                            .name("Global Education Loan")
                            .loanType(LoanType.EDUCATION)
                            .minAmount(new BigDecimal("5000.00"))
                            .maxAmount(new BigDecimal("150000.00"))
                            .interestRate(new BigDecimal("4.75"))
                            .minTenureMonths(12)
                            .maxTenureMonths(120)
                            .processingFeePercentage(new BigDecimal("0.25"))
                            .status(LoanProductStatus.ACTIVE)
                            .description("Low-interest student financing for undergraduate and post-graduate university tuition.")
                            .build()
            );

            productRepository.saveAll(defaultProducts);
            log.info("Successfully seeded {} default loan products", defaultProducts.size());
        }
    }
}
