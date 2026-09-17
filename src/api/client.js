import axios from 'axios';

// Create Axios instance pointing to the API service
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fincore_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401
      localStorage.removeItem('fincore_token');
      localStorage.removeItem('fincore_user');
    }
    return Promise.reject(error);
  }
);

// Comprehensive API operations
export const apiClient = {
  // Auth
  login: (username, password) => api.post('/auth/login', { username, password }),
  getMe: () => api.get('/auth/me'),

  // Customers
  getCustomers: () => api.get('/customers'),
  getCustomerById: (id) => api.get(`/customers/${id}`),
  createCustomer: (customerData) => api.post('/customers', customerData),

  // Accounts & Identity Verification (KYC, Audit Trail, RBAC)
  getKycRecords: () => api.get('/kyc'),
  submitKyc: (kycData) => api.post('/kyc/submit', kycData),
  verifyKyc: (kycId, status, notes, reviewerName) =>
    api.post('/kyc/verify', { kycId, status, notes, reviewerName }),

  // Core Ledger Transactions (Transfers, Cash Deposits, Withdrawals, History)
  getTransactions: (accountNumber, customerId) => {
    const params = new URLSearchParams();
    if (accountNumber) params.append('accountNumber', accountNumber);
    if (customerId) params.append('customerId', customerId);
    const qs = params.toString();
    return api.get(`/transactions${qs ? `?${qs}` : ''}`);
  },
  transferMoney: (transferData) => api.post('/transactions/transfer', transferData),
  depositMoney: (depositData) => api.post('/transactions/deposit', depositData),
  withdrawMoney: (withdrawData) => api.post('/transactions/withdraw', withdrawData),

  // Credit & Lending (Loans, Repayments & NPA Engine)
  getLoans: () => api.get('/loans'),
  getRepayments: (loanId) => api.get(`/repayments${loanId ? `?loanId=${loanId}` : ''}`),
  payRepayment: (loanId, amount, paidBy) =>
    api.post('/repayments/pay', { loanId, amount, paidBy }),

  // Distributed Disbursement Sagas
  getSagas: () => api.get('/sagas'),
  executeSaga: (sagaId, customerName, amount) =>
    api.post('/sagas/execute', { sagaId, customerName, amount }),

  // Treasury Operations & Interbank Settlements
  getSettlements: () => api.get('/settlements'),
  confirmSettlement: (settlementId) =>
    api.post('/settlements/confirm', { settlementId }),

  getNotifications: () => api.get('/notifications'),
  sendNotification: (payload) => api.post('/notifications/send', payload),

  // Credit Risk Intelligence
  getRiskScores: () => api.get('/risk'),
  reassessRisk: (customerId, newCreditScore, notes) =>
    api.post('/risk/reassess', { customerId, newCreditScore, notes }),

  // Regulatory AML & PEP Compliance
  getComplianceChecks: () => api.get('/compliance'),
  submitComplianceCheck: (data) => api.post('/compliance/submit', data),
  reviewComplianceCheck: (checkId, status, reviewedBy, notes) =>
    api.post('/compliance/review', { checkId, status, reviewedBy, notes }),

  // Cryptographic Ledger Integrity & SHA-256 Audit Trail
  getAuditLogs: () => api.get('/audit/logs'),
  checkAuditIntegrity: () => api.get('/audit/integrity'),
  simulateTamper: (blockIndex) => api.post('/audit/tamper', { blockIndex }),
  restoreLedger: () => api.post('/audit/restore'),
  getAuditAlerts: () => api.get('/audit/alerts'),
  resolveAuditAlert: (alertId, resolutionNotes, investigatedBy) =>
    api.post('/audit/alerts/resolve', { alertId, resolutionNotes, investigatedBy }),

  // Cross-Module Integration
  runCrossModuleWorkflow: (customerName) =>
    api.post('/cross-module/run-workflow', { workflowType: 'CUSTOMER_KYC_RISK_COMPLIANCE', customerName }),
};

export default api;
