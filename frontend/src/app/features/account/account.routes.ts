import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/account-list/account-list.component').then(m => m.AccountListComponent),
    data: { breadcrumb: 'Accounts' }
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/account-form/account-form.component').then(m => m.AccountFormComponent),
    data: { breadcrumb: 'New Account' }
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/account-details/account-details.component').then(m => m.AccountDetailsComponent),
    data: { breadcrumb: 'Account Details' }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/account-form/account-form.component').then(m => m.AccountFormComponent),
    data: { breadcrumb: 'Edit Account' }
  }
];
