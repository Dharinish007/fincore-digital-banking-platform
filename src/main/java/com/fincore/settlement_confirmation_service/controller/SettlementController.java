package com.fincore.settlement_confirmation_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fincore.settlement_confirmation_service.dto.SettlementResponseDTO;
import com.fincore.settlement_confirmation_service.service.SettlementService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.fincore.settlement_confirmation_service.enums.SettlementStatus;
import com.fincore.settlement_confirmation_service.dto.SettlementStatisticsDTO;
import com.fincore.settlement_confirmation_service.dto.SettlementConfirmationResponseDTO;


@RestController
@RequestMapping("/api/v1/settlements")
public class SettlementController {
	
	private final SettlementService settlementService;
	
	public SettlementController(SettlementService settlementService) {
		this.settlementService=settlementService;
	}
	
	@GetMapping
	public List<SettlementResponseDTO> getAllSettlements() {
	    return settlementService.getAllSettlements();
	}
	
	@GetMapping("/{id}")
	public SettlementResponseDTO getSettlementById(@PathVariable Long id) {
		return settlementService.getSettlementById(id);
	}
	
	@PutMapping("/{id}/confirm")
	public SettlementConfirmationResponseDTO confirmSettlement(
	        @PathVariable Long id,
	        @RequestParam String managerId) {

	    return settlementService.confirmSettlement(id, managerId);
	}
	
	@GetMapping("/search")
	public List<SettlementResponseDTO> searchSettlements(
	        @RequestParam String value) {

	    return settlementService.searchSettlements(value);
	}
	
	@GetMapping("/status/{status}")
	public List<SettlementResponseDTO> getSettlementsByStatus(
	        @PathVariable SettlementStatus status) {

	    return settlementService.getSettlementsByStatus(status);
	}
	@GetMapping("/statistics")
	public SettlementStatisticsDTO getStatistics() {

	    return settlementService.getStatistics();
	}

}
