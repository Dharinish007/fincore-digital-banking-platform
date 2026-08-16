package com.bankingapp.originationservice.repository;

import com.bankingapp.originationservice.entity.OriginationApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OriginationApplicationRepository
        extends JpaRepository<OriginationApplication, Long> {
}