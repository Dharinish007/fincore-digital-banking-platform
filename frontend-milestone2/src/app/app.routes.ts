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
  { path: 'pre-qualification', redirectTo: 'loan-origination/pre-qualification', pathMatch: 'full' },
  { path: 'loan-application', redirectTo: 'loan-origination/loan-application', pathMatch: 'full' },
  { path: 'applications', redirectTo: 'loan-origination/applications', pathMatch: 'full' },
  { path: 'processing', redirectTo: 'loan-origination/applications', pathMatch: 'full' },
  { path: 'underwriting', redirectTo: 'loan-origination/applications', pathMatch: 'full' },
  { path: 'quality-control', redirectTo: 'loan-origination/applications', pathMatch: 'full' },
  { path: 'loan-funding', redirectTo: 'loan-origination/applications', pathMatch: 'full' },
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
    path: 'credit-check/new',
    redirectTo: 'credit-check/new-check',
    pathMatch: 'full'
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
