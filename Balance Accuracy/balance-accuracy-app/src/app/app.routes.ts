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
    path: '**',
    redirectTo: ''
  }
];
