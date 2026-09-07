export interface RiskAssessment {
  customerId: string;
  transactionId: string;
  amount: number;
  transactionType: string;
  accountType: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'APPROVED' | 'FLAGGED' | 'REJECTED' | 'UNDER_REVIEW';
  riskFactors: string[];
  assessedAt: string;
  hasPreviousHistory?: boolean;
  isCustomerVerified?: boolean;
}
