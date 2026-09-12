export type LoanType = 'Personal' | 'Home' | 'Vehicle' | 'Education' | 'Gold' | 'Other';

export type ApplicationStage =
  | 'Pre-Qualification'
  | 'Loan Application'
  | 'Application Processing'
  | 'Underwriting'
  | 'Quality Control'
  | 'Loan Funding';

export type ApplicationStatus = 'Draft' | 'Under Review' | 'Approved' | 'Rejected' | 'Funded' | 'Pending';

/**
 * Direct payload matching backend LoanOrigination entity (POST /api/loan-origination)
 */
export interface LoanOriginationPayload {
  customerId: number;
  loanType: LoanType;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  purpose?: string;
}

/**
 * Unified Loan Application model supporting backend fields and frontend UI compatibility
 */
export interface LoanApplication {
  loanId?: number;
  id?: string;
  customerId: number | string;
  loanType: LoanType | string;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number | string;
  purpose?: string;
  applicationStatus?: ApplicationStatus;
  status?: ApplicationStatus;
  applicationDate?: string;

  // Compatibility fields for existing pipeline / dashboard views
  fullName?: string;
  requestedAmount?: number;
  tenure?: string;
  stage?: ApplicationStage;
  dateOfBirth?: string;
  gender?: string;
  mobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  idType?: string;
  idNumber?: string;
  employmentType?: string;
  employerName?: string;
  jobTitle?: string;
  workExperience?: string | number;
  monthlyIncome?: number;
  otherIncome?: number;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  existingEmi?: number;
  creditScore?: number;
  hasCoApplicant?: boolean;
  coApplicantName?: string;
  coApplicantRelation?: string;
  coApplicantMobile?: string;
  coApplicantIncome?: number;
  documents?: { name: string; type: string; status: 'Uploaded' | 'Pending' | 'Verified'; fileName?: string }[];
  approvedAmount?: number;
  approvedTenure?: string;
  fundingAccount?: string;
  fundingStatus?: string;
}

export interface PreQualificationData {
  customerId: number | string;
  fullName: string;
  dateOfBirth?: string;
  mobile: string;
  email: string;
  loanType: LoanType;
  requestedAmount: number;
  employmentType: string;
  monthlyIncome: number;
  existingEmi?: number;
  creditScore?: number;
  maxEligibleAmount?: number;
  estimatedEmi?: number;
  estimatedRate?: number;
  isEligible?: boolean;
  rejectionReason?: string;
}
