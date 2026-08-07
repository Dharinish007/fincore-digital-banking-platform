import { Notification } from '../../features/dashboard/models/dashboard.model';

export const DASHBOARD_SUMMARY_MOCK = {
  totalCustomers: 12450,
  totalAccounts: 28930,
  totalVolume: 45200000,
  activeUsers: 840,
  recentTransactionsCount: 154
};

export const SUMMARY_CARDS_MOCK = [
  { title: 'Total Customers', value: '12,450', icon: 'groups', trend: 5.2, iconBgColor: 'var(--accent-light)', iconColor: 'var(--accent)' },
  { title: 'Active Accounts', value: '28,930', icon: 'account_balance_wallet', trend: 2.1, iconBgColor: 'var(--success-light)', iconColor: 'var(--success-dark)' },
  { title: 'Today\'s Transactions', value: '1,420', icon: 'sync_alt', trend: -1.4, iconBgColor: 'var(--warning-light)', iconColor: 'var(--warning-dark)' },
  { title: 'Total Deposits', value: '$4.2M', icon: 'south_west', trend: 8.4, iconBgColor: 'var(--info-light)', iconColor: 'var(--info-dark)' },
  { title: 'Pending Approvals', value: '45', icon: 'pending_actions', trend: 12, iconBgColor: 'var(--danger-light)', iconColor: 'var(--danger-dark)' },
  { title: 'Active Loans', value: '3,200', icon: 'real_estate_agent', trend: 0.5, iconBgColor: 'var(--accent-glow)', iconColor: 'var(--accent-hover)' }
];

export const DASHBOARD_RECENT_TRANSACTIONS_MOCK = [
  { id: 'TXN-8923', accountId: 'ACC-102', type: 'DEPOSIT',    amount: 2500,  currency: 'USD', status: 'COMPLETED', reference: 'Salary Transfer',     description: 'Monthly Salary',         createdAt: new Date().toISOString() },
  { id: 'TXN-8924', accountId: 'ACC-105', type: 'WITHDRAWAL', amount: 150,   currency: 'USD', status: 'COMPLETED', reference: 'ATM Withdrawal',       description: 'Cash Withdrawal',        createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'TXN-8925', accountId: 'ACC-204', type: 'TRANSFER',   amount: 450,   currency: 'USD', status: 'PENDING',   reference: 'Rent Payment',         description: 'Transfer to Landlord',   createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'TXN-8926', accountId: 'ACC-102', type: 'PAYMENT',    amount: 85.50, currency: 'USD', status: 'COMPLETED', reference: 'Utility Bill',         description: 'Electric Bill',          createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: 'TXN-8927', accountId: 'ACC-309', type: 'FEE',        amount: 15,    currency: 'USD', status: 'FAILED',    reference: 'Monthly Maintenance',  description: 'Account Fee',            createdAt: new Date(Date.now() - 86400000).toISOString() }
];

export const NOTIFICATIONS_MOCK: Notification[] = [
  { id: 'N-1', title: 'System Maintenance', message: 'Scheduled maintenance this Sunday at 2 AM EST.', date: new Date().toISOString(), type: 'info', read: false },
  { id: 'N-2', title: 'High Volume Alert', message: 'Transaction volume is 20% higher than average today.', date: new Date(Date.now() - 3600000).toISOString(), type: 'warning', read: false },
  { id: 'N-3', title: 'Security Alert', message: 'Failed login attempt detected from new IP address.', date: new Date(Date.now() - 7200000).toISOString(), type: 'alert', read: true },
  { id: 'N-4', title: 'Batch Processing', message: 'Overnight batch processing completed successfully.', date: new Date(Date.now() - 86400000).toISOString(), type: 'success', read: true }
];

export const ACTIVITY_TIMELINE_MOCK = [
  { id: 'A-1', action: 'Customer Created', description: 'New retail customer John Doe onboarded.', timestamp: new Date().toISOString(), icon: 'person_add', actor: 'Employee JS' },
  { id: 'A-2', action: 'Account Opened', description: 'Checking account ACC-5932 opened.', timestamp: new Date(Date.now() - 1800000).toISOString(), icon: 'account_balance', actor: 'System' },
  { id: 'A-3', action: 'Transaction Approved', description: 'Wire transfer TXN-8821 approved.', timestamp: new Date(Date.now() - 5400000).toISOString(), icon: 'check_circle', actor: 'Admin' },
  { id: 'A-4', action: 'Loan Request Submitted', description: 'Mortgage application received from Jane Smith.', timestamp: new Date(Date.now() - 12000000).toISOString(), icon: 'request_quote', actor: 'System' },
  { id: 'A-5', action: 'Employee Login', employee: 'Employee JS', description: 'Successful authentication.', timestamp: new Date(Date.now() - 24000000).toISOString(), icon: 'login', actor: 'Employee JS' }
];

export const MONTHLY_TRANSACTIONS_CHART_MOCK = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Transactions (Thousands)',
      data: [65, 59, 80, 81, 56, 95],
      backgroundColor: 'rgba(37, 99, 235, 0.5)',
      borderColor: 'rgba(37, 99, 235, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }
  ]
};

export const DEPOSITS_VS_WITHDRAWALS_CHART_MOCK = {
  labels: ['Deposits', 'Withdrawals', 'Transfers'],
  datasets: [
    {
      data: [55, 30, 15],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderWidth: 0
    }
  ]
};

export const CUSTOMER_GROWTH_CHART_MOCK = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Retail',
      data: [120, 150, 180, 220],
      backgroundColor: 'rgba(37, 99, 235, 0.8)'
    },
    {
      label: 'Corporate',
      data: [30, 45, 55, 70],
      backgroundColor: 'rgba(15, 23, 42, 0.8)'
    }
  ]
};
