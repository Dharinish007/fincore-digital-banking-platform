import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'credit-check',
    pathMatch: 'full',
  },
  {
    path: 'credit-check',
    loadComponent: () =>
      import('./features/credit-check/components/dashboard/credit-check-dashboard.component').then(
        (m) => m.CreditCheckDashboardComponent,
      ),
  },
  {
    path: 'credit-check/new',
    loadComponent: () =>
      import('./features/credit-check/components/new-check/credit-check-form.component').then(
        (m) => m.CreditCheckFormComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'credit-check',
  },
];
