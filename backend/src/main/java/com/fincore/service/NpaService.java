package com.fincore.service;

import com.fincore.entity.Loan;
import com.fincore.entity.NpaRecord;
import com.fincore.repository.LoanRepository;
import com.fincore.repository.NpaRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NpaService {

    @Autowired
    private NpaRecordRepository npaRecordRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private AuditService auditService;

    public List<NpaRecord> getAllNpaRecords() {
        return npaRecordRepository.findAll();
    }

    public List<NpaRecord> evaluateAllLoansNpa() {
        List<Loan> loans = loanRepository.findAll();
        List<NpaRecord> results = new ArrayList<>();

        for (Loan loan : loans) {
            int dpd = loan.getDpdDays() != null ? loan.getDpdDays() : 0;
            String category = "STANDARD";
            BigDecimal provisionRate = new BigDecimal("0.40"); // 0.40%

            if (dpd > 90) {
                category = "SUBSTANDARD_NPA";
                provisionRate = new BigDecimal("15.00"); // 15%
            } else if (dpd > 60) {
                category = "SMA_2";
                provisionRate = new BigDecimal("5.00");
            } else if (dpd > 30) {
                category = "SMA_1";
                provisionRate = new BigDecimal("5.00");
            } else if (dpd > 0) {
                category = "SMA_0";
                provisionRate = new BigDecimal("5.00");
            }

            BigDecimal outstanding = loan.getOutstandingPrincipal() != null ? loan.getOutstandingPrincipal() : loan.getPrincipalAmount();
            BigDecimal provisionAmt = outstanding.multiply(provisionRate).divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);

            NpaRecord record = npaRecordRepository.findByLoanId(loan.getId())
                    .orElse(NpaRecord.builder().loanId(loan.getId()).build());

            record.setLoanNumber(loan.getLoanNumber());
            record.setCustomerName(loan.getCustomerName());
            record.setDpdDays(dpd);
            record.setClassificationCategory(category);
            record.setOutstandingAmount(outstanding);
            record.setProvisionPercentage(provisionRate);
            record.setProvisionAmount(provisionAmt);
            record.setLastEvaluatedAt(LocalDateTime.now());

            results.add(npaRecordRepository.save(record));

            loan.setNpaStatus(category);
            loanRepository.save(loan);
        }

        auditService.recordAudit("NPA_EVALUATION", "NpaRecord", "ALL", "SYSTEM", "ADMIN",
                "Automated NPA Asset Classification executed for " + results.size() + " credit loans");

        return results;
    }
}
