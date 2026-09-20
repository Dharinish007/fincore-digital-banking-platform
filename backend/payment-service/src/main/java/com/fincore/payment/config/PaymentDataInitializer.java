package com.fincore.payment.config;

import com.fincore.payment.entity.Payment;
import com.fincore.payment.enums.PaymentMode;
import com.fincore.payment.enums.PaymentStatus;
import com.fincore.payment.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class PaymentDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(PaymentDataInitializer.class);
    private final PaymentRepository paymentRepository;

    public PaymentDataInitializer(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void run(String... args) {
        if (paymentRepository.count() == 0) {
            log.info("Seeding initial payment history for FinCore platform...");

            Payment p1 = new Payment();
            p1.setPaymentReference("UPI-FINC-892103452");
            p1.setCustomerId(1L);
            p1.setBeneficiaryId(1L);
            p1.setAmount(new BigDecimal("15000.00"));
            p1.setPaymentMode(PaymentMode.UPI);
            p1.setStatus(PaymentStatus.SUCCESS);
            p1.setRemarks("Monthly Rent");
            p1.setCreatedAt(LocalDateTime.now().minusDays(3));
            p1.setUpdatedAt(LocalDateTime.now().minusDays(3));
            paymentRepository.save(p1);

            Payment p2 = new Payment();
            p2.setPaymentReference("IMPS-FINC-561234981");
            p2.setCustomerId(1L);
            p2.setBeneficiaryId(2L);
            p2.setAmount(new BigDecimal("45000.00"));
            p2.setPaymentMode(PaymentMode.IMPS);
            p2.setStatus(PaymentStatus.SUCCESS);
            p2.setRemarks("Vendor Payment");
            p2.setCreatedAt(LocalDateTime.now().minusDays(1));
            p2.setUpdatedAt(LocalDateTime.now().minusDays(1));
            paymentRepository.save(p2);

            Payment p3 = new Payment();
            p3.setPaymentReference("NEFT-FINC-309182736");
            p3.setCustomerId(2L);
            p3.setBeneficiaryId(3L);
            p3.setAmount(new BigDecimal("250000.00"));
            p3.setPaymentMode(PaymentMode.NEFT);
            p3.setStatus(PaymentStatus.SUCCESS);
            p3.setRemarks("Equipment Purchase");
            p3.setCreatedAt(LocalDateTime.now().minusHours(5));
            p3.setUpdatedAt(LocalDateTime.now().minusHours(5));
            paymentRepository.save(p3);

            log.info("Seeded 3 sample payments.");
        }
    }
}
