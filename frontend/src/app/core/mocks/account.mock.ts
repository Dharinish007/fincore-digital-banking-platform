import { Account, AccountType, AccountStatus, Currency } from '../../features/account/models/account.model';

export const ACCOUNT_BRANCHES_MOCK = ['Downtown', 'Westside', 'Northgate', 'Eastview', 'Southpark'];

export const ACCOUNT_CUSTOMER_STUBS_MOCK = [
  { id: 'CUST-0001', name: 'James Harrison' },
  { id: 'CUST-0002', name: 'Sarah Mitchell' },
  { id: 'CUST-0003', name: 'Robert Chen' },
  { id: 'CUST-0004', name: 'Emily Rodriguez' },
  { id: 'CUST-0005', name: 'Michael Thompson' },
  { id: 'CUST-0006', name: 'Jessica Williams' },
  { id: 'CUST-0007', name: 'David Anderson' },
  { id: 'CUST-0008', name: 'Amanda Garcia' }
];

export const ACCOUNTS_MOCK: Account[] = [
  {
    id: 'ACC-0001', accountId: 'ACC-0001', accountNumber: 'FIN-100-0001', customerId: 'CUST-0001',
    customerName: 'James Harrison', accountType: AccountType.SAVINGS,
    branch: 'Downtown', balance: 24850.75, availableBalance: 24350.75,
    currency: 'USD', status: AccountStatus.ACTIVE,
    openedAt: '2021-04-12T09:00:00Z', updatedAt: '2024-03-10T14:00:00Z'
  },
  {
    id: 'ACC-0002', accountId: 'ACC-0002', accountNumber: 'FIN-100-0002', customerId: 'CUST-0001',
    customerName: 'James Harrison', accountType: AccountType.CURRENT,
    branch: 'Downtown', balance: 8200.00, availableBalance: 8200.00,
    currency: 'USD', status: AccountStatus.ACTIVE,
    openedAt: '2021-04-12T09:00:00Z', updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: 'ACC-0003', accountId: 'ACC-0003', accountNumber: 'FIN-200-0001', customerId: 'CUST-0002',
    customerName: 'Sarah Mitchell', accountType: AccountType.SAVINGS,
    branch: 'Westside', balance: 5600.50, availableBalance: 5600.50,
    currency: 'USD', status: AccountStatus.ACTIVE,
    openedAt: '2022-01-20T09:00:00Z', updatedAt: '2024-02-28T08:00:00Z'
  },
  {
    id: 'ACC-0004', accountId: 'ACC-0004', accountNumber: 'FIN-300-0001', customerId: 'CUST-0003',
    customerName: 'Robert Chen', accountType: AccountType.CURRENT,
    branch: 'Northgate', balance: 150000.00, availableBalance: 148000.00,
    currency: 'USD', status: AccountStatus.ACTIVE,
    openedAt: '2020-09-25T09:00:00Z', updatedAt: '2024-03-20T12:00:00Z'
  },
  {
    id: 'ACC-0005', accountId: 'ACC-0005', accountNumber: 'FIN-300-0002', customerId: 'CUST-0003',
    customerName: 'Robert Chen', accountType: AccountType.SAVINGS,
    branch: 'Northgate', balance: 500000.00, availableBalance: 0,
    currency: 'USD', status: AccountStatus.ACTIVE,
    openedAt: '2021-06-01T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z',
    description: '12-month fixed term deposit at 4.5% p.a.'
  },
  {
    id: 'ACC-0006', accountId: 'ACC-0006', accountNumber: 'FIN-400-0001', customerId: 'CUST-0004',
    customerName: 'Emily Rodriguez', accountType: AccountType.SAVINGS,
    branch: 'Eastview', balance: 1200.00, availableBalance: 1200.00,
    currency: 'USD', status: AccountStatus.INACTIVE,
    openedAt: '2023-06-05T09:00:00Z', updatedAt: '2023-09-01T11:00:00Z'
  },
  {
    id: 'ACC-0007', accountId: 'ACC-0007', accountNumber: 'FIN-500-0001', customerId: 'CUST-0005',
    customerName: 'Michael Thompson', accountType: AccountType.CURRENT,
    branch: 'Southpark', balance: 320.00, availableBalance: 0,
    currency: 'USD', status: AccountStatus.BLOCKED,
    openedAt: '2022-11-10T09:00:00Z', updatedAt: '2024-01-25T09:30:00Z'
  },
  {
    id: 'ACC-0008', accountId: 'ACC-0008', accountNumber: 'FIN-600-0001', customerId: 'CUST-0006',
    customerName: 'Jessica Williams', accountType: AccountType.SAVINGS,
    branch: 'Downtown', balance: 9870.25, availableBalance: 9870.25,
    currency: 'USD', status: AccountStatus.ACTIVE,
    openedAt: '2021-08-25T09:00:00Z', updatedAt: '2024-02-14T16:00:00Z'
  },
  {
    id: 'ACC-0009', accountId: 'ACC-0009', accountNumber: 'FIN-600-0002', customerId: 'CUST-0006',
    customerName: 'Jessica Williams', accountType: AccountType.CURRENT,
    branch: 'Downtown', balance: 25000.00, availableBalance: 0,
    currency: 'EUR', status: AccountStatus.ACTIVE,
    openedAt: '2023-02-01T09:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
    description: '6-month fixed term deposit at 3.8% p.a.'
  },
  {
    id: 'ACC-0010', accountId: 'ACC-0010', accountNumber: 'FIN-700-0001', customerId: 'CUST-0007',
    customerName: 'David Anderson', accountType: AccountType.CURRENT,
    branch: 'Westside', balance: 78600.00, availableBalance: 75000.00,
    currency: 'USD', status: AccountStatus.ACTIVE,
    openedAt: '2019-03-15T09:00:00Z', updatedAt: '2024-03-18T12:00:00Z'
  }
];
