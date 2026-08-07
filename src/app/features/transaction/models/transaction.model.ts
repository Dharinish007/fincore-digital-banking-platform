// ============================================================
// transaction.model.ts — Transaction Domain Models
// ============================================================

export enum TransactionType {
  DEPOSIT    = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER   = 'TRANSFER',
  PAYMENT    = 'PAYMENT',
  FEE        = 'FEE'
}

export enum TransactionStatus {
  PENDING   = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED    = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface Transaction {
  id:                    string;
  referenceNumber:       string;
  customerId:            string;
  customerName:          string;
  sourceAccountId:       string;
  sourceAccountNumber:   string;
  destinationAccountId?: string;
  destinationAccountNumber?: string;
  type:                  TransactionType;
  amount:                number;
  currency:              Currency;
  status:                TransactionStatus;
  description:           string;
  createdBy:             string;
  transactionDate:       string;
  createdAt:             string;
  completedAt?:          string;
  remarks?:              string;
}

export interface TransactionSummary {
  id:                  string;
  referenceNumber:     string;
  customerId:          string;
  customerName:        string;
  sourceAccountNumber: string;
  type:                TransactionType;
  amount:              number;
  currency:            Currency;
  status:              TransactionStatus;
  createdBy:           string;
  transactionDate:     string;
}

export interface TransactionFilter {
  search?:         string;
  transactionType?: TransactionType | null;
  status?:         TransactionStatus | null;
  dateFrom?:       string | null;
  dateTo?:         string | null;
}

export interface TransactionHistory {
  transactionId:  string;
  referenceNumber: string;
  date:           string;
  type:           TransactionType;
  amount:         number;
  currency:       Currency;
  status:         TransactionStatus;
  accountNumber:  string;
  description:    string;
}

export interface CreateTransactionPayload {
  sourceAccountId:       string;
  destinationAccountId?: string;
  type:                  TransactionType;
  amount:                number;
  currency:              Currency;
  description:           string;
  referenceNumber:       string;
  transactionDate:       string;
}
