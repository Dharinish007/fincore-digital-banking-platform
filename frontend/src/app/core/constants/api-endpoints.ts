export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  USERS: {
    ME: '/users/me'
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary'
  },
  CUSTOMERS: {
  BASE: '/customers',
  BY_ID: (id: string | number) => `/customers/${id}`,
  BY_NUMBER: (customerNumber: string) => `/customers/number/${customerNumber}`,
  SEARCH: '/customers/search',
  BY_KYC_STATUS: (status: string) => `/customers/kyc-status/${status}`,
  KYC_STATUS: (id: string | number) => `/customers/${id}/kyc-status`,
  STATISTICS: '/customers/statistics'
},
  ACCOUNTS: {
  BASE: '/accounts',
  BY_ID: (id: string | number) => `/accounts/${id}`,
  BY_NUMBER: (accountNumber: string) => `/accounts/number/${accountNumber}`,
  BY_CUSTOMER: (customerId: string | number) => `/accounts?customerId=${customerId}`,
  STATUS: (id: string | number) => `/accounts/${id}/status`,
  STATISTICS: '/accounts/statistics'
},
  TRANSACTIONS: {
    BASE: '/transactions',
    BY_ACCOUNT: (accountNumber: string | number) => `/transactions/history/${accountNumber}`
  },
  LOANS: {
    BASE: '/loans',
    BY_ID: (id: string | number) => `/loans/${id}`,
    BY_NUMBER: (loanNumber: string) => `/loans/number/${loanNumber}`,
    BY_CUSTOMER: (customerId: string | number) => `/loans/customer/${customerId}`,
    REPAYMENT_SCHEDULE: (id: string | number) => `/loans/${id}/repayment-schedule`,
    DISBURSE: (id: string | number) => `/loans/${id}/disburse`,
    CALCULATE_EMI: '/loans/calculate-emi',
    STATISTICS: '/loans/statistics',
    PRODUCTS: {
      BASE: '/loan-products',
      BY_ID: (id: string | number) => `/loan-products/${id}`,
      BY_CODE: (code: string) => `/loan-products/code/${code}`,
      STATUS: (id: string | number) => `/loan-products/${id}/status`
    },
    APPLICATIONS: {
      BASE: '/loan-applications',
      BY_ID: (id: string | number) => `/loan-applications/${id}`,
      BY_NUMBER: (applicationNumber: string) => `/loan-applications/number/${applicationNumber}`,
      BY_CUSTOMER: (customerId: string | number) => `/loan-applications/customer/${customerId}`,
      CREDIT_ASSESSMENT: (id: string | number) => `/loan-applications/${id}/credit-assessment`,
      APPROVE: (id: string | number) => `/loan-applications/${id}/approve`,
      REJECT: (id: string | number) => `/loan-applications/${id}/reject`
    }
  }
};
