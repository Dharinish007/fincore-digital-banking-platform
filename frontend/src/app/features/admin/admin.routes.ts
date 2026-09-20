import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/auth.models';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'loan-products',
    pathMatch: 'full'
  },
  {
    path: 'loan-products',
    canActivate: [roleGuard],
    data: { roles: [Role.ADMIN] },
    loadComponent: () =>
      import('./pages/loan-product-management/loan-product-management.component').then(
        (m) => m.LoanProductManagementComponent
      )
  }
];
