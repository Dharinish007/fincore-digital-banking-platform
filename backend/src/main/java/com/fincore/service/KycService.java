package com.fincore.service;

import com.fincore.entity.Customer;
import com.fincore.entity.KycRecord;
import com.fincore.repository.CustomerRepository;
import com.fincore.repository.KycRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KycService {

    @Autowired
    private KycRecordRepository kycRecordRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AuditService auditService;

    public List<KycRecord> getAllKycRecords() {
        return kycRecordRepository.findAll();
    }

    public KycRecord submitKyc(KycRecord record) {
        Customer customer = customerRepository.findById(record.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        record.setVerificationStatus(KycRecord.VerificationStatus.UNDER_REVIEW);
        record.setSubmittedAt(LocalDateTime.now());
        KycRecord saved = kycRecordRepository.save(record);

        customer.setKycStatus(Customer.KycStatus.UNDER_REVIEW);
        customerRepository.save(customer);

        auditService.recordAudit("KYC_SUBMITTED", "KycRecord", saved.getId(), record.getSubmittedBy(), "TELLER",
                "KYC document submitted for customer " + record.getFullName());

        return saved;
    }

    public KycRecord adjudicateKyc(String kycId, KycRecord.VerificationStatus status, String remarks, String verifiedBy) {
        KycRecord record = kycRecordRepository.findById(kycId)
                .orElseThrow(() -> new RuntimeException("KYC record not found"));

        record.setVerificationStatus(status);
        record.setRemarks(remarks);
        record.setVerifiedBy(verifiedBy != null ? verifiedBy : "SUPERVISOR");
        record.setVerifiedAt(LocalDateTime.now());
        KycRecord saved = kycRecordRepository.save(record);

        Customer customer = customerRepository.findById(record.getCustomerId()).orElse(null);
        if (customer != null) {
            customer.setKycStatus(status == KycRecord.VerificationStatus.VERIFIED ? Customer.KycStatus.VERIFIED : Customer.KycStatus.REJECTED);
            customerRepository.save(customer);
        }

        auditService.recordAudit("KYC_ADJUDICATED", "KycRecord", kycId, verifiedBy, "SUPERVISOR",
                "KYC status updated to " + status + " for customer " + record.getFullName());

        return saved;
    }
}
