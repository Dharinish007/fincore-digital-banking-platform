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
    BY_ID: (id: string) => `/customers/${id}`
  },
  ACCOUNTS: {
    BASE: '/accounts',
    BY_ID: (id: string) => `/accounts/${id}`,
    BY_CUSTOMER: (customerId: string) => `/customers/${customerId}/accounts`
  },
  TRANSACTIONS: {
    BASE: '/transactions',
    BY_ACCOUNT: (accountId: string) => `/accounts/${accountId}/transactions`
  }
};
