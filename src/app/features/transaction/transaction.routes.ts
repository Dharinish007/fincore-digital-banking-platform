import { Routes } from '@angular/router';

export const TRANSACTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./transaction.component').then(m => m.TransactionComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/transaction-list/transaction-list.component').then(m => m.TransactionListComponent),
        data: { breadcrumb: 'Transactions' }
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
        data: { breadcrumb: 'New Transaction' }
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/transaction-history/transaction-history.component').then(m => m.TransactionHistoryComponent),
        data: { breadcrumb: 'History' }
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/transaction-details/transaction-details.component').then(m => m.TransactionDetailsComponent),
        data: { breadcrumb: 'Transaction Details' }
      }
    ]
  }
];
