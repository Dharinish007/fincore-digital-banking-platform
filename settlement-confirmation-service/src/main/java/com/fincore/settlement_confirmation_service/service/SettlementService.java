package com.fincore.settlement_confirmation_service.service;

import java.util.List;

import com.fincore.settlement_confirmation_service.dto.SettlementConfirmationResponseDTO;
import com.fincore.settlement_confirmation_service.dto.SettlementResponseDTO;
import com.fincore.settlement_confirmation_service.dto.SettlementStatisticsDTO;
import com.fincore.settlement_confirmation_service.enums.SettlementStatus;

public interface SettlementService {
	
	List<SettlementResponseDTO> getAllSettlements();
	SettlementResponseDTO getSettlementById(Long id);
	SettlementConfirmationResponseDTO confirmSettlement(Long id, String managerId);
	SettlementStatisticsDTO getStatistics();
	List<SettlementResponseDTO> searchSettlements(String search);
	List<SettlementResponseDTO> getSettlementsByStatus(SettlementStatus status);

}
