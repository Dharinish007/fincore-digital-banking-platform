import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/customer-list/customer-list.component').then(m => m.CustomerListComponent),
    data: { breadcrumb: 'Customers' }
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/customer-form/customer-form.component').then(m => m.CustomerFormComponent),
    data: { breadcrumb: 'New Customer' }
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/customer-details/customer-details.component').then(m => m.CustomerDetailsComponent),
    data: { breadcrumb: 'Customer Details' }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/customer-form/customer-form.component').then(m => m.CustomerFormComponent),
    data: { breadcrumb: 'Edit Customer' }
  }
];
