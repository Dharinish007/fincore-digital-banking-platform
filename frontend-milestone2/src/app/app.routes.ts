import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'loan-origination',
    pathMatch: 'full'
  },
  {
    path: 'loan-origination',
    loadChildren: () =>
      import('./features/loan-origination/loan-origination.module').then(
        (m) => m.LoanOriginationModule
      )
  },
  {
    path: 'credit-check',
    loadComponent: () =>
      import(
        './features/credit-check/components/dashboard/credit-check-dashboard.component'
      ).then((m) => m.CreditCheckDashboardComponent)
  },
  {
    path: 'credit-check/new-check',
    loadComponent: () =>
      import(
        './features/credit-check/components/new-check/credit-check-form.component'
      ).then((m) => m.CreditCheckFormComponent)
  },
  {
    path: 'emi-calculator',
    loadComponent: () =>
      import('./features/emi-calculator/emi-calculator.component').then(
        (m) => m.EmiCalculatorComponent
      )
  },
  {
    path: '**',
    redirectTo: 'loan-origination'
  }
];
