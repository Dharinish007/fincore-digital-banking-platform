package com.fincore.BankingManagement.Milestone4.documentocr.repository;

import com.fincore.BankingManagement.Milestone4.documentocr.entity.DocumentOcr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentOcrRepository extends JpaRepository<DocumentOcr, Long> {
}