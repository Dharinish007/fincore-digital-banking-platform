package com.fincore.BankingManagement.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email")
    private String email;

    /*
     * M1 uses mobileNumber.
     * The actual database column is "phone".
     */
    @Column(name = "phone")
    private String mobileNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /*
     * These fields are kept as Java properties because some
     * application code may use them, but they are NOT columns
     * in the current customer table.
     */
    @Transient
    private LocalDate dateOfBirth;

    @Transient
    private String gender;

    @Transient
    private String emailId;

    @Transient
    private String address;

    @Transient
    private String employmentType;

    /*
     * M2 Credit Check uses customer.getSalary().
     * The current GitHub customer table has no salary column,
     * so keep the property without mapping it to the database.
     */
    @Transient
    private BigDecimal salary;

    @Transient
    private LocalDateTime timeStamp;

    @OneToMany(mappedBy = "customer")
    private List<Account> accounts;
}