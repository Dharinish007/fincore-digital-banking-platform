export type AccountStatus = 'Verified' | 'Mismatch' | 'Pending';

export type AccountType = 'Savings' | 'Checking' | 'Corporate' | 'Fixed Deposit' | 'Money Market';

export interface PendingTransaction {
  id: string;
  date: string;
  description: string;
  type: 'Debit' | 'Credit';
  amount: number;
  status: 'Pending' | 'Clearing' | 'Hold';
}

export interface HoldItem {
  id: string;
  type: 'Debit Hold' | 'Credit Hold';
  amount: number;
  reason: string;
  placedBy: string;
  placedDate: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  customerName: string;
  customerId: string;
  email: string;
  phone: string;
  branch: string;
  accountType: AccountType;
  ledgerBalance: number;
  availableBalance: number;
  systemCalculatedBalance: number;
  difference: number;
  status: AccountStatus;
  lastVerified: string;
  pendingTransactions: PendingTransaction[];
  debitHolds: HoldItem[];
  creditHolds: HoldItem[];
  remarks?: string;
  isFrozen: boolean;
  frozenReason?: string;
  kycStatus: 'Verified' | 'Pending Review' | 'Incomplete';
  currency: string;
}
