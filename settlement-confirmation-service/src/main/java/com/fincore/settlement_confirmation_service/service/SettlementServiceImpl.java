package com.fincore.settlement_confirmation_service.service;
import com.fincore.settlement_confirmation_service.entity.Settlement;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fincore.settlement_confirmation_service.dto.SettlementConfirmationResponseDTO;
import com.fincore.settlement_confirmation_service.dto.SettlementResponseDTO;
import com.fincore.settlement_confirmation_service.dto.SettlementStatisticsDTO;
import com.fincore.settlement_confirmation_service.enums.SettlementStatus;
import com.fincore.settlement_confirmation_service.repository.SettlementRepository;
import java.util.stream.Collectors;
@Service
public class SettlementServiceImpl implements SettlementService {
	
	private final SettlementRepository settlementRepository;

    public SettlementServiceImpl(SettlementRepository settlementRepository) {
        this.settlementRepository = settlementRepository;
    }
    
    private SettlementResponseDTO convertToDTO(Settlement settlement) {

        SettlementResponseDTO dto = new SettlementResponseDTO();

        dto.setSettlementId(settlement.getSettlementId());
        dto.setTransactionReference(settlement.getTransactionReference());
        dto.setCustomerName(settlement.getCustomerName());
        dto.setAccountNumber(settlement.getAccountNumber());
        dto.setSettlementAmount(settlement.getSettlementAmount());
        dto.setSettlementDate(settlement.getSettlementDate());
        dto.setTransactionCount(settlement.getTransactionCount());
        dto.setStatus(settlement.getStatus());
        dto.setManagerId(settlement.getManagerId());
        dto.setConfirmedAt(settlement.getConfirmedAt());

        return dto;
    }

    @Override
    public List<SettlementResponseDTO> getAllSettlements() {

        List<Settlement> settlements = settlementRepository.findAll();

        return settlements.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

	@Override
	public SettlementResponseDTO getSettlementById(Long id) {
		Settlement settlement = settlementRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Settlement not found"));

	    return convertToDTO(settlement);
	}

	@Override
	public SettlementConfirmationResponseDTO confirmSettlement(Long id, String managerId) {
		System.out.println("ID = " + id);
		System.out.println("Manager = " + managerId);
	    Settlement settlement = settlementRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Settlement not found"));

	    if (settlement.getStatus() != SettlementStatus.PENDING) {
	        throw new RuntimeException("Settlement is not pending");
	    }

	    settlement.setStatus(SettlementStatus.CONFIRMED);
	    settlement.setManagerId(managerId);
	    settlement.setConfirmedAt(LocalDateTime.now());

	    settlementRepository.save(settlement);

	    SettlementConfirmationResponseDTO response =
	            new SettlementConfirmationResponseDTO();

	    response.setSettlementId(settlement.getSettlementId());
	    response.setStatus(settlement.getStatus());
	    response.setManagerId(settlement.getManagerId());
	    response.setConfirmedAt(settlement.getConfirmedAt());
	    response.setMessage("Settlement confirmed successfully");

	    return response;
	}

	@Override
	public SettlementStatisticsDTO getStatistics() {

	    List<Settlement> settlements = settlementRepository.findAll();

	    long pendingCount = settlements.stream()
	            .filter(s -> s.getStatus() == SettlementStatus.PENDING)
	            .count();

	    long confirmedCount = settlements.stream()
	            .filter(s -> s.getStatus() == SettlementStatus.CONFIRMED)
	            .count();

	    BigDecimal totalValue = settlements.stream()
	            .map(Settlement::getSettlementAmount)
	            .reduce(BigDecimal.ZERO, BigDecimal::add);

	    long totalTransactions = settlements.stream()
	            .mapToLong(Settlement::getTransactionCount)
	            .sum();

	    SettlementStatisticsDTO dto = new SettlementStatisticsDTO();

	    dto.setPendingSettlements(pendingCount);
	    dto.setConfirmedSettlements(confirmedCount);
	    dto.setTotalSettlementValue(totalValue);
	    dto.setTotalTransactions(totalTransactions);

	    return dto;
	}
	@Override
	public List<SettlementResponseDTO> searchSettlements(String search) {

	    List<Settlement> settlements =
	            settlementRepository
	            .findBySettlementIdContainingIgnoreCaseOrTransactionReferenceContainingIgnoreCaseOrCustomerNameContainingIgnoreCase(
	                    search, search, search);

	    return settlements.stream()
	            .map(this::convertToDTO)
	            .collect(Collectors.toList());
	}

	@Override
	public List<SettlementResponseDTO> getSettlementsByStatus(SettlementStatus status) {

	    List<Settlement> settlements =
	            settlementRepository.findByStatus(status);

	    return settlements.stream()
	            .map(this::convertToDTO)
	            .collect(Collectors.toList());
	}

}
