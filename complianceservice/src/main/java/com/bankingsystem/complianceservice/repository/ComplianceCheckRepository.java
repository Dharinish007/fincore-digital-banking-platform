package com.bankingsystem.complianceservice.repository;

import com.bankingsystem.complianceservice.entity.ComplianceCheck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplianceCheckRepository extends JpaRepository<ComplianceCheck, Long> {
}
