package com.fincore.kyc_service.dto;

import lombok.Data;
@Data
public class KycResponseDTO {
	
	
	private Long kycId;
	private String status;
	private String message;
	public void setKycId(Long kycId2) {
		// TODO Auto-generated method stub
		
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Long getKycId() {
		return kycId;
	}

}
