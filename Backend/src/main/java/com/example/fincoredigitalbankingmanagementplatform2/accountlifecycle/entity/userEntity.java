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
    private Integer customerId;

    @Column(name = "first_name" , length = 50)
    private String firstName;

    @Column(name = "last_name" , length = 50)
    private String lastName;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "address", length = 200)
    private String address;

    @Column(name = "kyc_status" , length = 20)
    private String kycStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String password;

    @OneToMany(mappedBy = "customerId")
    private List<accountEntity> accounts;
}

