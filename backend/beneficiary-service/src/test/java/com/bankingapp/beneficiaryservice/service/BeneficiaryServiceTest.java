package com.bankingapp.beneficiaryservice.service;

import com.bankingapp.beneficiaryservice.dto.BeneficiaryRequest;
import com.bankingapp.beneficiaryservice.dto.BeneficiaryResponse;
import com.bankingapp.beneficiaryservice.entity.Beneficiary;
import com.bankingapp.beneficiaryservice.enums.BeneficiaryStatus;
import com.bankingapp.beneficiaryservice.exception.BeneficiaryNotFoundException;
import com.bankingapp.beneficiaryservice.repository.BeneficiaryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeneficiaryServiceTest {

    @Mock
    private BeneficiaryRepository beneficiaryRepository;

    @InjectMocks
    private BeneficiaryServiceImpl beneficiaryService;

    private BeneficiaryRequest request;
    private Beneficiary beneficiary;

    @BeforeEach
    void setUp() {
        request = new BeneficiaryRequest();
        request.setCustomerId(101L);
        request.setBeneficiaryName("Alice Smith");
        request.setAccountNumber("987654321012");
        request.setIfscCode("SBIN0001234");
        request.setBankName("State Bank of India");

        beneficiary = new Beneficiary();
        beneficiary.setBeneficiaryId(1L);
        beneficiary.setCustomerId(101L);
        beneficiary.setBeneficiaryName("Alice Smith");
        beneficiary.setAccountNumber("987654321012");
        beneficiary.setIfscCode("SBIN0001234");
        beneficiary.setBankName("State Bank of India");
        beneficiary.setStatus(BeneficiaryStatus.ACTIVE);
    }

    @Test
    void createBeneficiary_Success() {
        when(beneficiaryRepository.save(any(Beneficiary.class))).thenReturn(beneficiary);

        BeneficiaryResponse response = beneficiaryService.createBeneficiary(request);

        assertNotNull(response);
        assertEquals(1L, response.getBeneficiaryId());
        assertEquals("Alice Smith", response.getBeneficiaryName());
        assertEquals("987654321012", response.getAccountNumber());
        assertEquals(BeneficiaryStatus.ACTIVE, response.getStatus());
    }

    @Test
    void getBeneficiaryById_Success() {
        when(beneficiaryRepository.findById(1L)).thenReturn(Optional.of(beneficiary));

        BeneficiaryResponse response = beneficiaryService.getBeneficiaryById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getBeneficiaryId());
    }

    @Test
    void getBeneficiaryById_NotFound_ThrowsException() {
        when(beneficiaryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(BeneficiaryNotFoundException.class, () -> beneficiaryService.getBeneficiaryById(999L));
    }

    @Test
    void getBeneficiariesByCustomer_Success() {
        when(beneficiaryRepository.findByCustomerId(101L)).thenReturn(List.of(beneficiary));

        List<BeneficiaryResponse> list = beneficiaryService.getBeneficiariesByCustomer(101L);

        assertEquals(1, list.size());
        assertEquals("Alice Smith", list.get(0).getBeneficiaryName());
    }

    @Test
    void updateBeneficiary_Success() {
        when(beneficiaryRepository.findById(1L)).thenReturn(Optional.of(beneficiary));
        when(beneficiaryRepository.save(any(Beneficiary.class))).thenReturn(beneficiary);

        request.setBeneficiaryName("Alice Updated");
        BeneficiaryResponse response = beneficiaryService.updateBeneficiary(1L, request);

        assertNotNull(response);
    }

    @Test
    void deleteBeneficiary_Success() {
        when(beneficiaryRepository.findById(1L)).thenReturn(Optional.of(beneficiary));
        doNothing().when(beneficiaryRepository).delete(beneficiary);

        assertDoesNotThrow(() -> beneficiaryService.deleteBeneficiary(1L));
        verify(beneficiaryRepository, times(1)).delete(beneficiary);
    }

    @Test
    void getAllBeneficiaries_Success() {
        when(beneficiaryRepository.findAll()).thenReturn(List.of(beneficiary));

        List<BeneficiaryResponse> list = beneficiaryService.getAllBeneficiaries();

        assertEquals(1, list.size());
    }
}
