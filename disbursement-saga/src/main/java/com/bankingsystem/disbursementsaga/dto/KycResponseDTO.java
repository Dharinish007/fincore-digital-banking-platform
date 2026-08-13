package com.bankingsystem.disbursementsaga.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KycResponseDTO {

    private Long kycId;
    private String status;
    private String message;
}
