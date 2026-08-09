import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/balance-accuracy/components/balance-accuracy-dashboard.component').then(
        (m) => m.BalanceAccuracyDashboardComponent,
      ),
  },
  {
    path: 'transfer',
    loadComponent: () =>
      import('./features/balance-accuracy/components/transfer/transfer.component').then(
        (m) => m.TransferComponent,
      ),
  },
  {
    path: 'open-account',
    loadComponent: () =>
      import('./features/balance-accuracy/components/open-account/open-account.component').then(
        (m) => m.OpenAccountComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
