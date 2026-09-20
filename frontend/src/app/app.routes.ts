import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/auth.models';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then(
        (m) => m.AUTHENTICATION_ROUTES
      )
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTES
          )
      },
      {
        path: 'customer',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.EMPLOYEE] },
        loadChildren: () =>
          import('./features/customer/customer.routes').then(
            (m) => m.CUSTOMER_ROUTES
          )
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./features/account/account.routes').then(
            (m) => m.ACCOUNT_ROUTES
          )
      },
      {
        path: 'transaction',
        loadChildren: () =>
          import('./features/transaction/transaction.routes').then(
            (m) => m.TRANSACTION_ROUTES
          )
      },
      {
        path: 'loan',
        loadChildren: () =>
          import('./features/loan/loan.routes').then(
            (m) => m.LOAN_ROUTES
          )
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN] },
        loadChildren: () =>
          import('./features/admin/admin.routes').then(
            (m) => m.ADMIN_ROUTES
          )
      }
    ]
  },
  {
    path: '403',
    loadComponent: () => import('./features/errors/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
