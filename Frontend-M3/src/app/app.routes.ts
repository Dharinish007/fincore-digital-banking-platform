import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'payment-initiation',
    pathMatch: 'full',
  },
  {
    path: 'payment-initiation',
    loadComponent: () =>
      import('./payment-initiation/payment-initiation.component').then(
        (m) => m.PaymentInitiationComponent
      ),
  },
  {
    path: 'beneficiary-verification',
    loadComponent: () =>
      import('./beneficiary-verification/beneficiary-verification.component').then(
        (m) => m.BeneficiaryVerificationComponent
      ),
  },
  {
    path: 'payments',
    redirectTo: 'payment-initiation',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'payment-initiation',
  },
];
