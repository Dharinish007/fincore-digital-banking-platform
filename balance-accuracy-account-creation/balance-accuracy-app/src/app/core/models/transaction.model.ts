export type TransactionType = 'Transfer' | 'Deposit' | 'Withdraw';

export type TransactionStatus = 'Processing' | 'Success' | 'Failed' | 'Rolled Back' | 'Pending';

export interface Transaction {
  id: string;
  sender: string;
  senderName?: string;
  receiver: string;
  receiverName?: string;
  type: TransactionType;
  amount: number;
  date: string;
  time?: string;
  reference: string;
  status: TransactionStatus;
  remarks?: string;
  failureReason?: string;
  description?: string;
  charges?: number;
}

export interface TransactionSummaryStats {
  total: number;
  success: number;
  failed: number;
  pending: number;
  amount: number;
  todayCount: number;
  successRate: number;
}

export interface TransactionFilterCriteria {
  searchQuery?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}
