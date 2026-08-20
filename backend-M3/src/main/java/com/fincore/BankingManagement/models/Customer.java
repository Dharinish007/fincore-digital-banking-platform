package com.fincore.BankingManagement.models;

import com.fincore.BankingManagement.Beneficiary.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name="customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer{
    @Id
    @Column(name = "customer_id")
    private long id;
    private String first_name;
    private String last_name;
    @Column(unique=true)
    private String email;
    private String phone;
    private Date date_of_birth;
    @Enumerated(EnumType.STRING)
    @Column(name="gender")
    private Gender gender=Gender.Male;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Date created_at;
    private Date updated_at;
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<beneficiary> beneficiaries;
    @PrePersist
    public void prepersisit(){
        this.created_at=new Date();
    }
}
