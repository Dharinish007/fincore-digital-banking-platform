export interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  type: 'Transfer'|'Deposit'|'Withdraw';
  amount: number;
  date: string;
  time?: string;
  reference: string;
  status: 'Processing'|'Success'|'Failed'|'Rolled Back'|'Pending';
  remarks?: string;
  failureReason?: string;
  description?: string;
  charges?: number;
}
