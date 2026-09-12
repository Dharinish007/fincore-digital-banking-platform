package com.example.milestone2loanmanagement.disbursement;


import com.example.milestone2loanmanagement.collection.LoanEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "disbursements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private LoanEntity loan;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDateTime disbursementDate;

    @Column(unique = true, nullable = false)
    private String referenceNumber;

    @Column(nullable = false)
    private String beneficiaryAccount;

    private String status;
}
