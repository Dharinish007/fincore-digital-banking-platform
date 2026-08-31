package com.fincore.kyc_service.dto;


public class KycResponseDTO {

	

	    private Long kycId;
	    private String firstName;
	    private String lastName;
	    private String email;
	    private String governmentIdType;
	    private String governmentIdNumber;
	    private String city;
	    private String status;
	    private String message;
	private boolean pepDeclaration;
	private String occupationStatus;
	private String annualIncomeRange;

	 
    public String getFirstName() {
			return firstName;
		}

		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}

		public String getLastName() {
			return lastName;
		}

		public void setLastName(String lastName) {
			this.lastName = lastName;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getGovernmentIdType() {
			return governmentIdType;
		}

		public void setGovernmentIdType(String governmentIdType) {
			this.governmentIdType = governmentIdType;
		}

		public String getGovernmentIdNumber() {
			return governmentIdNumber;
		}

		public void setGovernmentIdNumber(String governmentIdNumber) {
			this.governmentIdNumber = governmentIdNumber;
		}

		public String getCity() {
			return city;
		}

		public void setCity(String city) {
			this.city = city;
		}

	public Long getKycId() {
        return kycId;
    }

    public void setKycId(Long kycId) {
        this.kycId = kycId;
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

	public boolean isPepDeclaration() {
		return pepDeclaration;
	}
	public void setPepDeclaration(boolean pepDeclaration) {
		this.pepDeclaration = pepDeclaration;
	}
	public String getOccupationStatus() {
		return occupationStatus;
	}
	public void setOccupationStatus(String occupationStatus) {
		this.occupationStatus = occupationStatus;
	}
	public String getAnnualIncomeRange() {
		return annualIncomeRange;
	}
	public void setAnnualIncomeRange(String annualIncomeRange) {
		this.annualIncomeRange = annualIncomeRange;
	}
}
