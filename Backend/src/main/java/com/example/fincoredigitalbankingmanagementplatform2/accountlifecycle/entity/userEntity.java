package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="customer")
public class userEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String email;

    private String phone;

    private String address;

    @Column(name = "kyc_status")
    private String kycStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String password;

    @OneToMany(mappedBy = "customerId")
    private List<accountEntity> accounts;
}

