import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'balance-accuracy',
    pathMatch: 'full',
  },
  {
    path: 'balance-accuracy',
    loadComponent: () =>
      import('./features/balance-accuracy/components/balance-accuracy-dashboard.component').then(
        (m) => m.BalanceAccuracyDashboardComponent,
      ),
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./features/balance-accuracy/components/open-account/open-account.component').then(
        (m) => m.OpenAccountComponent,
      ),
  },
  {
    path: 'open-account',
    redirectTo: 'accounts',
    pathMatch: 'full',
  },
  {
    path: 'fund-transfer',
    loadComponent: () =>
      import('./features/balance-accuracy/components/transfer/transfer.component').then(
        (m) => m.TransferComponent,
      ),
  },
  {
    path: 'transfer',
    redirectTo: 'fund-transfer',
    pathMatch: 'full',
  },
  {
    path: 'transactions/confirm',
    loadComponent: () =>
      import('./features/transactions/components/transaction-confirmation/transaction-confirmation.component').then(
        (m) => m.TransactionConfirmationComponent,
      ),
  },
  {
    path: 'transactions/status/:id',
    loadComponent: () =>
      import('./features/transactions/components/transaction-status/transaction-status.component').then(
        (m) => m.TransactionStatusComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'balance-accuracy',
  },
];
