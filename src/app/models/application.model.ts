export type ApplicationStage =
  | 'Pre-Qualification'
  | 'Loan Application'
  | 'Application Processing'
  | 'Underwriting'
  | 'Quality Control'
  | 'Loan Funding';

export type ApplicationStatus = 'Draft' | 'Under Review' | 'Approved' | 'Rejected' | 'Funded' | 'Pending';

export interface LoanApplication {
  id: string;
  customerId: string;
  fullName: string;
  dateOfBirth: string;
  gender?: string;
  mobile: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  employmentType?: string;
  employerName?: string;
  jobTitle?: string;
  workExperience?: string;
  monthlyIncome?: number;
  otherIncome?: number;
  loanType: string;
  requestedAmount: number;
  tenure: string;
  purpose?: string;
  applicationDate: string;
  stage: ApplicationStage;
  status: ApplicationStatus;
  approvedAmount?: number;
  approvedTenure?: string;
  interestRate?: string;
  fundingAccount?: string;
  fundingStatus?: string;
}
