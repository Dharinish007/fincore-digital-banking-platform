import { Transaction, TransactionType, TransactionStatus, Currency } from '../../features/transaction/models/transaction.model';

export const TRANSACTIONS_MOCK: Transaction[] = [
  {
    id: 'TXN-0001', referenceNumber: 'REF-20240301-0001',
    customerId: 'CUST-0001', customerName: 'James Harrison',
    sourceAccountId: 'ACC-0001', sourceAccountNumber: 'FIN-100-0001',
    type: TransactionType.DEPOSIT, amount: 5000.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Monthly salary credit',
    createdBy: 'admin@fincore.com', transactionDate: '2024-03-01T09:00:00Z',
    createdAt: '2024-03-01T09:00:00Z', completedAt: '2024-03-01T09:01:30Z'
  },
  {
    id: 'TXN-0002', referenceNumber: 'REF-20240305-0002',
    customerId: 'CUST-0001', customerName: 'James Harrison',
    sourceAccountId: 'ACC-0001', sourceAccountNumber: 'FIN-100-0001',
    destinationAccountId: 'ACC-0002', destinationAccountNumber: 'FIN-100-0002',
    type: TransactionType.TRANSFER, amount: 1500.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Transfer to checking account',
    createdBy: 'teller01@fincore.com', transactionDate: '2024-03-05T11:30:00Z',
    createdAt: '2024-03-05T11:30:00Z', completedAt: '2024-03-05T11:31:00Z'
  },
  {
    id: 'TXN-0003', referenceNumber: 'REF-20240308-0003',
    customerId: 'CUST-0002', customerName: 'Sarah Mitchell',
    sourceAccountId: 'ACC-0003', sourceAccountNumber: 'FIN-200-0001',
    type: TransactionType.WITHDRAWAL, amount: 800.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'ATM cash withdrawal',
    createdBy: 'system@fincore.com', transactionDate: '2024-03-08T15:00:00Z',
    createdAt: '2024-03-08T15:00:00Z', completedAt: '2024-03-08T15:00:45Z'
  },
  {
    id: 'TXN-0004', referenceNumber: 'REF-20240310-0004',
    customerId: 'CUST-0003', customerName: 'Robert Chen',
    sourceAccountId: 'ACC-0004', sourceAccountNumber: 'FIN-300-0001',
    type: TransactionType.PAYMENT, amount: 25000.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Vendor payment – Acme Corp',
    createdBy: 'manager@fincore.com', transactionDate: '2024-03-10T10:00:00Z',
    createdAt: '2024-03-10T10:00:00Z', completedAt: '2024-03-10T10:05:00Z'
  },
  {
    id: 'TXN-0005', referenceNumber: 'REF-20240312-0005',
    customerId: 'CUST-0003', customerName: 'Robert Chen',
    sourceAccountId: 'ACC-0004', sourceAccountNumber: 'FIN-300-0001',
    type: TransactionType.FEE, amount: 25.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Monthly maintenance fee',
    createdBy: 'system@fincore.com', transactionDate: '2024-03-12T00:00:00Z',
    createdAt: '2024-03-12T00:00:00Z', completedAt: '2024-03-12T00:00:05Z'
  },
  {
    id: 'TXN-0006', referenceNumber: 'REF-20240315-0006',
    customerId: 'CUST-0004', customerName: 'Emily Rodriguez',
    sourceAccountId: 'ACC-0006', sourceAccountNumber: 'FIN-400-0001',
    type: TransactionType.DEPOSIT, amount: 300.00, currency: 'USD',
    status: TransactionStatus.FAILED, description: 'Cheque deposit – returned',
    createdBy: 'teller02@fincore.com', transactionDate: '2024-03-15T14:30:00Z',
    createdAt: '2024-03-15T14:30:00Z',
    remarks: 'Cheque dishonoured – insufficient funds at issuer'
  },
  {
    id: 'TXN-0007', referenceNumber: 'REF-20240318-0007',
    customerId: 'CUST-0005', customerName: 'Michael Thompson',
    sourceAccountId: 'ACC-0007', sourceAccountNumber: 'FIN-500-0001',
    type: TransactionType.WITHDRAWAL, amount: 200.00, currency: 'USD',
    status: TransactionStatus.FAILED, description: 'Withdrawal request – cancelled by customer',
    createdBy: 'teller01@fincore.com', transactionDate: '2024-03-18T09:15:00Z',
    createdAt: '2024-03-18T09:15:00Z',
    remarks: 'Customer requested cancellation at counter'
  },
  {
    id: 'TXN-0008', referenceNumber: 'REF-20240320-0008',
    customerId: 'CUST-0006', customerName: 'Jessica Williams',
    sourceAccountId: 'ACC-0008', sourceAccountNumber: 'FIN-600-0001',
    type: TransactionType.TRANSFER, amount: 5000.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Savings to fixed deposit transfer',
    createdBy: 'admin@fincore.com', transactionDate: '2024-03-20T12:00:00Z',
    createdAt: '2024-03-20T12:00:00Z', completedAt: '2024-03-20T12:02:00Z'
  },
  {
    id: 'TXN-0009', referenceNumber: 'REF-20240322-0009',
    customerId: 'CUST-0007', customerName: 'David Anderson',
    sourceAccountId: 'ACC-0010', sourceAccountNumber: 'FIN-700-0001',
    type: TransactionType.PAYMENT, amount: 12500.50, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Quarterly tax payment',
    createdBy: 'manager@fincore.com', transactionDate: '2024-03-22T08:45:00Z',
    createdAt: '2024-03-22T08:45:00Z'
  },
  {
    id: 'TXN-0010', referenceNumber: 'REF-20240325-0010',
    customerId: 'CUST-0001', customerName: 'James Harrison',
    sourceAccountId: 'ACC-0002', sourceAccountNumber: 'FIN-100-0002',
    type: TransactionType.PAYMENT, amount: 450.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Utility bill payment',
    createdBy: 'teller02@fincore.com', transactionDate: '2024-03-25T16:00:00Z',
    createdAt: '2024-03-25T16:00:00Z', completedAt: '2024-03-25T16:01:10Z'
  },
  {
    id: 'TXN-0011', referenceNumber: 'REF-20240326-0011',
    customerId: 'CUST-0006', customerName: 'Jessica Williams',
    sourceAccountId: 'ACC-0009', sourceAccountNumber: 'FIN-600-0002',
    type: TransactionType.DEPOSIT, amount: 7500.00, currency: 'EUR',
    status: TransactionStatus.SUCCESS, description: 'International wire transfer receipt',
    createdBy: 'admin@fincore.com', transactionDate: '2024-03-26T10:30:00Z',
    createdAt: '2024-03-26T10:30:00Z', completedAt: '2024-03-26T10:35:00Z'
  },
  {
    id: 'TXN-0012', referenceNumber: 'REF-20240327-0012',
    customerId: 'CUST-0002', customerName: 'Sarah Mitchell',
    sourceAccountId: 'ACC-0003', sourceAccountNumber: 'FIN-200-0001',
    type: TransactionType.FEE, amount: 10.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Online banking transaction fee',
    createdBy: 'system@fincore.com', transactionDate: '2024-03-27T00:00:00Z',
    createdAt: '2024-03-27T00:00:00Z', completedAt: '2024-03-27T00:00:05Z'
  },
  {
    id: 'TXN-0013', referenceNumber: 'REF-20240328-0013',
    customerId: 'CUST-0003', customerName: 'Robert Chen',
    sourceAccountId: 'ACC-0004', sourceAccountNumber: 'FIN-300-0001',
    destinationAccountId: 'ACC-0005', destinationAccountNumber: 'FIN-300-0002',
    type: TransactionType.TRANSFER, amount: 100000.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Capital transfer to fixed deposit',
    createdBy: 'manager@fincore.com', transactionDate: '2024-03-28T09:00:00Z',
    createdAt: '2024-03-28T09:00:00Z'
  },
  {
    id: 'TXN-0014', referenceNumber: 'REF-20240329-0014',
    customerId: 'CUST-0007', customerName: 'David Anderson',
    sourceAccountId: 'ACC-0010', sourceAccountNumber: 'FIN-700-0001',
    type: TransactionType.WITHDRAWAL, amount: 5000.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Branch cash withdrawal',
    createdBy: 'teller01@fincore.com', transactionDate: '2024-03-29T11:45:00Z',
    createdAt: '2024-03-29T11:45:00Z', completedAt: '2024-03-29T11:46:30Z'
  },
  {
    id: 'TXN-0015', referenceNumber: 'REF-20240330-0015',
    customerId: 'CUST-0004', customerName: 'Emily Rodriguez',
    sourceAccountId: 'ACC-0006', sourceAccountNumber: 'FIN-400-0001',
    type: TransactionType.DEPOSIT, amount: 1200.00, currency: 'USD',
    status: TransactionStatus.SUCCESS, description: 'Cash deposit at branch counter',
    createdBy: 'teller02@fincore.com', transactionDate: '2024-03-30T13:30:00Z',
    createdAt: '2024-03-30T13:30:00Z', completedAt: '2024-03-30T13:31:00Z'
  }
];

export const TRANSACTION_ACCOUNT_STUBS_MOCK = [
  { id: 'ACC-0001', accountNumber: 'FIN-100-0001', customerId: 'CUST-0001', customerName: 'James Harrison' },
  { id: 'ACC-0002', accountNumber: 'FIN-100-0002', customerId: 'CUST-0001', customerName: 'James Harrison' },
  { id: 'ACC-0003', accountNumber: 'FIN-200-0001', customerId: 'CUST-0002', customerName: 'Sarah Mitchell' },
  { id: 'ACC-0004', accountNumber: 'FIN-300-0001', customerId: 'CUST-0003', customerName: 'Robert Chen' },
  { id: 'ACC-0005', accountNumber: 'FIN-300-0002', customerId: 'CUST-0003', customerName: 'Robert Chen' },
  { id: 'ACC-0006', accountNumber: 'FIN-400-0001', customerId: 'CUST-0004', customerName: 'Emily Rodriguez' },
  { id: 'ACC-0007', accountNumber: 'FIN-500-0001', customerId: 'CUST-0005', customerName: 'Michael Thompson' },
  { id: 'ACC-0008', accountNumber: 'FIN-600-0001', customerId: 'CUST-0006', customerName: 'Jessica Williams' },
  { id: 'ACC-0009', accountNumber: 'FIN-600-0002', customerId: 'CUST-0006', customerName: 'Jessica Williams' },
  { id: 'ACC-0010', accountNumber: 'FIN-700-0001', customerId: 'CUST-0007', customerName: 'David Anderson' }
];

export const TRANSACTION_CURRENCIES_MOCK: Currency[] = ['USD', 'EUR', 'GBP', 'INR'];
