package com.bankingapp.beneficiaryservice.config;

import com.bankingapp.beneficiaryservice.entity.Beneficiary;
import com.bankingapp.beneficiaryservice.enums.BeneficiaryStatus;
import com.bankingapp.beneficiaryservice.repository.BeneficiaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class BeneficiaryDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(BeneficiaryDataInitializer.class);
    private final BeneficiaryRepository beneficiaryRepository;

    public BeneficiaryDataInitializer(BeneficiaryRepository beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }

    @Override
    public void run(String... args) {
        if (beneficiaryRepository.count() == 0) {
            log.info("Seeding initial beneficiaries for FinCore platform...");

            Beneficiary b1 = new Beneficiary();
            b1.setCustomerId(1L);
            b1.setBeneficiaryName("Priya Sharma");
            b1.setAccountNumber("100234567890");
            b1.setIfscCode("HDFC0001234");
            b1.setBankName("HDFC Bank");
            b1.setStatus(BeneficiaryStatus.ACTIVE);
            beneficiaryRepository.save(b1);

            Beneficiary b2 = new Beneficiary();
            b2.setCustomerId(1L);
            b2.setBeneficiaryName("Aakash Patel");
            b2.setAccountNumber("987654321098");
            b2.setIfscCode("SBIN0005678");
            b2.setBankName("State Bank of India");
            b2.setStatus(BeneficiaryStatus.ACTIVE);
            beneficiaryRepository.save(b2);

            Beneficiary b3 = new Beneficiary();
            b3.setCustomerId(2L);
            b3.setBeneficiaryName("Ananya Reddy");
            b3.setAccountNumber("456789123456");
            b3.setIfscCode("ICIC0009876");
            b3.setBankName("ICICI Bank");
            b3.setStatus(BeneficiaryStatus.ACTIVE);
            beneficiaryRepository.save(b3);

            log.info("Seeded 3 sample beneficiaries.");
        }
    }
}
