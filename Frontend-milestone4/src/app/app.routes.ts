import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'liveness', pathMatch: 'full' },
  { 
    path: 'liveness', 
    loadComponent: () => import('./modules/kyc/kyc.component').then(m => m.KycComponent) 
  },
  {
    path: 'risk',
    loadComponent: () => import('./modules/fraud-detection/fraud-detection.component').then(m => m.FraudDetectionComponent)
  },
  { 
    path: 'audit', 
    loadComponent: () => import('./modules/audit/audit.component').then(m => m.AuditComponent) 
  },
  { path: '**', redirectTo: 'liveness' }
];
