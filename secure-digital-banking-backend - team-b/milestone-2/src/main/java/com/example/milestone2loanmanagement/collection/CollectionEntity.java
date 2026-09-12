package com.example.milestone2loanmanagement.collection;

import com.example.milestone2loanmanagement.EMI.EMIEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "collections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emi_id")
    private EMIEntity emi;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amountDue;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amountCollected = BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate collectionDate;

    private Integer daysOverdue;

    @Column(nullable = false)
    private String status;
}
