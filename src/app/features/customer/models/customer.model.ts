export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

export enum CustomerType {
  RETAIL = 'RETAIL',
  CORPORATE = 'CORPORATE',
  PREMIUM = 'PREMIUM',
  SME = 'SME'
}

export enum KycStatus {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  customerType: CustomerType;
  status: CustomerStatus;
  kycStatus: KycStatus;
  branch: string;
  address: CustomerAddress;
  linkedAccountsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  status: CustomerStatus;
  branch: string;
  linkedAccountsCount: number;
  createdAt: string;
}

export interface CustomerFilter {
  search?: string;
  status?: CustomerStatus | null;
  customerType?: CustomerType | null;
  branch?: string | null;
}
