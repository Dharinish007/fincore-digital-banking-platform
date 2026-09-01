package com.digitalBanking.documentOCR.repository;

import com.digitalBanking.documentOCR.entity.DocumentOcr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentOcrRepository extends JpaRepository<DocumentOcr, Long> {
}