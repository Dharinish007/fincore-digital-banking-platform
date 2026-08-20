import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/auth.models';

export const LOAN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/loan-dashboard/loan-dashboard.component').then(
        (m) => m.LoanDashboardComponent
      )
  },
  {
    path: 'apply',
    canActivate: [roleGuard],
    data: { roles: [Role.CUSTOMER] },
    loadComponent: () =>
      import('./pages/loan-apply/loan-apply.component').then(
        (m) => m.LoanApplyComponent
      )
  },
  {
    path: 'review',
    canActivate: [roleGuard],
    data: { roles: [Role.EMPLOYEE] },
    loadComponent: () =>
      import('./pages/loan-review/loan-review.component').then(
        (m) => m.LoanReviewComponent
      )
  },
  {
    path: 'application/:id',
    loadComponent: () =>
      import('./pages/loan-details/loan-details.component').then(
        (m) => m.LoanDetailsComponent
      )
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/loan-details/loan-details.component').then(
        (m) => m.LoanDetailsComponent
      )
  }
];
