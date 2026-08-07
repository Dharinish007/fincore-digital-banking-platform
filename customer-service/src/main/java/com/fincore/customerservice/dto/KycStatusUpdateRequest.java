package com.fincore.customerservice.dto;

import com.fincore.customerservice.enums.KycStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KycStatusUpdateRequest {

    @NotNull(message = "KYC status is required")
    private KycStatus kycStatus;

    private String remarks;
}
