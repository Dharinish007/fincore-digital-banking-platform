import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'fraud-detection', pathMatch: 'full' },
  { 
    path: 'fraud-detection', 
    loadComponent: () => import('./modules/fraud-detection/fraud-detection.component').then(m => m.FraudDetectionComponent) 
  },
  { 
    path: 'settlement-engine', 
    loadComponent: () => import('./modules/settlement-engine/settlement-engine.component').then(m => m.SettlementEngineComponent) 
  },
  { 
    path: 'notification-service', 
    loadComponent: () => import('./modules/notification-service/notification-service.component').then(m => m.NotificationServiceComponent) 
  },
  { 
    path: 'loans', 
    loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent) 
  },
  { 
    path: 'accounts', 
    loadComponent: () => import('./modules/accounts/accounts.component').then(m => m.AccountsComponent) 
  },
  { 
    path: 'payments', 
    loadComponent: () => import('./modules/payments/payments.component').then(m => m.PaymentsComponent) 
  },
  { 
    path: 'kyc', 
    loadComponent: () => import('./modules/kyc/kyc.component').then(m => m.KycComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'audit', 
    loadComponent: () => import('./modules/audit/audit.component').then(m => m.AuditComponent) 
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent) 
  },
  { path: '**', redirectTo: 'fraud-detection' }
];
