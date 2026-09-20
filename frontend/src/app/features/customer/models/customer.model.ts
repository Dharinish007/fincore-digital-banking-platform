export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}

export enum KycStatus {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Customer {
  id: number;
  customerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  kycStatus: KycStatus;
  riskLevel: RiskLevel;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSummary extends Customer {}

export interface CustomerFilter {
  search?: string;
  status?: CustomerStatus | null;
  kycStatus?: KycStatus | null;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type UpdateCustomerRequest = Partial<CreateCustomerRequest>;

export interface CustomerStatistics {
  totalCustomers: number;
  activeCustomers: number;
  pendingKyc: number;
  verifiedKyc: number;
  rejectedKyc?: number;
  newCustomersThisMonth?: number;
  [key: string]: any;
}