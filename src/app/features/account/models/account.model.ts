import { CustomerSummary } from '../../customer/models/customer.model';

export enum AccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING',
  FIXED_DEPOSIT = 'FIXED_DEPOSIT',
  CURRENT = 'CURRENT'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  DORMANT = 'DORMANT',
  CLOSED = 'CLOSED',
  FROZEN = 'FROZEN',
  PENDING = 'PENDING'
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface Account {
  id: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  accountType: AccountType;
  branch: string;
  balance: number;
  availableBalance: number;
  currency: Currency;
  status: AccountStatus;
  openedAt: string;
  updatedAt: string;
  description?: string;
}

export interface AccountSummary {
  id: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  accountType: AccountType;
  branch: string;
  balance: number;
  currency: Currency;
  status: AccountStatus;
  openedAt: string;
}

export interface AccountFilter {
  search?: string;
  status?: AccountStatus | null;
  accountType?: AccountType | null;
  branch?: string | null;
}
