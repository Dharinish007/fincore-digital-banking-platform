package com.example.milestone3.settlementEngine.repo;

import com.example.milestone3.settlementEngine.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettlementRepo extends JpaRepository<Settlement, Long> {
}
