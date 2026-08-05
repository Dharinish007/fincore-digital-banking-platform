package com.fincore.BankingManagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable=false)
    private String fullName;
    @Column(unique=true, nullable=false)
    private String email;
    @Column(nullable=false)
    private String mobileNumber;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Account account;
    @Column(nullable=false)
    private String password;
}
