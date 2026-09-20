export const environment = {
  production: false,
  appName: 'FinCore Enterprise',
  appVersion: '1.0.0-dev',

  apiBaseUrl: 'http://localhost:8080/api/v1',
  useMockApi: false,

  features: {
    dashboard: true,
    customer: true,
    account: true,
    transaction: true
  }
};