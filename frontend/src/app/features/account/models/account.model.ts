export enum AccountType {
  SAVINGS = 'SAVINGS',
  CURRENT = 'CURRENT'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED'
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | string;

export interface Account {
  id?: number | string;
  accountId: number | string;
  customerId: number | string;
  accountNumber: string;
  accountType: AccountType | string;
  balance: number;
  availableBalance?: number;
  currency?: Currency | string;
  branch?: string;
  status: AccountStatus | string;
  openedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  customerName?: string;
  description?: string;
}

export interface AccountSummary extends Account {}

export interface AccountFilter {
  search?: string;
  status?: AccountStatus | string | null;
  accountType?: AccountType | string | null;
  customerId?: string | number | null;
}

export interface CreateAccountRequest {
  customerId: string | number;
  accountType: AccountType | string;
  initialBalance: number;
}

export interface UpdateAccountRequest {
  accountType: AccountType | string;
}

export interface AccountStatusUpdateRequest {
  status: AccountStatus | string;
}

export interface AccountStatistics {
  totalAccounts: number;
  activeAccounts: number;
  inactiveAccounts?: number;
  blockedAccounts?: number;
  closedAccounts?: number;
  savingsAccounts?: number;
  currentAccounts?: number;
  totalBalance: number;
  averageBalance?: number;
}
