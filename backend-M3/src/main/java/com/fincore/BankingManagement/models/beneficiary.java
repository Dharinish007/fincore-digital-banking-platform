package com.fincore.BankingManagement.models;

import com.fincore.BankingManagement.Beneficiary.enums.Beneficiary_type;
import com.fincore.BankingManagement.Beneficiary.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="beneficiary")
public class beneficiary {
    @Id
    private long beneficiary_id;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="customer_id")
    private Customer customer;
    private String beneficiary_name;
    private String account_no;
    private String ifsc;
    private String bank_name;
    @Enumerated(EnumType.STRING)
    private Beneficiary_type beneficiary_type=Beneficiary_type.Internal;
    @Enumerated(EnumType.STRING)
    private Status status=Status.Pending;
    private Date created_at;

    @PrePersist
    public void prePersist(){
        this.created_at = new Date();
    }
}
