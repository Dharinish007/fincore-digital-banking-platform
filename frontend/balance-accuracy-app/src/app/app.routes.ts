import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/balance-accuracy/components/balance-accuracy-dashboard.component').then(
        m => m.BalanceAccuracyDashboardComponent
      )
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./features/accounts/components/new-account/new-account.component').then(
        m => m.NewAccountComponent
      )
  },
  {
    path: 'transactions',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/transactions/components/transaction-dashboard/transaction-dashboard.component').then(
            m => m.TransactionDashboardComponent
          )
      },
      {
        path: 'initiate',
        loadComponent: () =>
          import('./features/transactions/components/initiate-transaction/initiate-transaction.component').then(
            m => m.InitiateTransactionComponent
          )
      },
      {
        path: 'confirm',
        loadComponent: () =>
          import('./features/transactions/components/transaction-confirmation/transaction-confirmation.component').then(
            m => m.TransactionConfirmationComponent
          )
      },
      {
        path: 'status/:id',
        loadComponent: () =>
          import('./features/transactions/components/transaction-status/transaction-status.component').then(
            m => m.TransactionStatusComponent
          )
      },
      {
        path: 'status',
        loadComponent: () =>
          import('./features/transactions/components/transaction-status/transaction-status.component').then(
            m => m.TransactionStatusComponent
          )
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./features/transactions/components/transaction-history/transaction-history.component').then(
            m => m.TransactionHistoryComponent
          )
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./features/transactions/components/transaction-details/transaction-details.component').then(
            m => m.TransactionDetailsComponent
          )
      }
    ]
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/transactions/components/reports/reports.component').then(
        m => m.ReportsComponent
      )
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/transactions/components/profile/profile.component').then(
        m => m.ProfileComponent
      )
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/transactions/components/settings/settings.component').then(
        m => m.SettingsComponent
      )
  },
  {
    path: 'support',
    loadComponent: () =>
      import('./features/transactions/components/support/support.component').then(
        m => m.SupportComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
