import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'core-dashboard', 
    loadComponent: () => import('./modules/core-dashboard/core-dashboard.component').then(m => m.CoreDashboardComponent) 
  },
  { 
    path: 'accounts', 
    loadComponent: () => import('./modules/account-lifecycle/account-lifecycle').then(m => m.AccountLifecycleComponent) 
  },
  { 
    path: 'balance', 
    loadComponent: () => import('./modules/balance-management/balance-management').then(m => m.BalanceManagementComponent) 
  },
  { 
    path: 'statements', 
    loadComponent: () => import('./modules/statements/statements.component').then(m => m.StatementsComponent) 
  },
  { 
    path: 'loans', 
    loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent),
    data: { tab: 'SERVICING' }
  },
  { 
    path: 'loans/emi', 
    loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent),
    data: { tab: 'EMI' }
  },
  { 
    path: 'loans/disbursement', 
    loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent),
    data: { tab: 'DISBURSEMENT' }
  },
  { 
    path: 'loans/collections', 
    loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent),
    data: { tab: 'COLLECTIONS' }
  },
  { 
    path: 'payments', 
    loadComponent: () => import('./modules/payments/payments.component').then(m => m.PaymentsComponent) 
  },
  { 
    path: 'settlement', 
    loadComponent: () => import('./modules/settlement-engine/settlement-engine.component').then(m => m.SettlementEngineComponent) 
  },
  { path: 'settlement-engine', redirectTo: 'settlement', pathMatch: 'full' },
  { 
    path: 'ledger', 
    loadComponent: () => import('./modules/accounts-ledger/accounts.component').then(m => m.AccountsLedgerComponent) 
  },
  { 
    path: 'notifications', 
    loadComponent: () => import('./modules/notification-service/notification-service.component').then(m => m.NotificationServiceComponent) 
  },
  { path: 'notification-service', redirectTo: 'notifications', pathMatch: 'full' },
  { 
    path: 'liveness', 
    loadComponent: () => import('./modules/kyc/kyc.component').then(m => m.KycComponent) 
  },
  { path: 'kyc', redirectTo: 'liveness', pathMatch: 'full' },
  { 
    path: 'fraud-detection', 
    loadComponent: () => import('./modules/fraud-detection/fraud-detection.component').then(m => m.FraudDetectionComponent) 
  },
  { 
    path: 'risk', 
    loadComponent: () => import('./modules/risk-assessment/risk-assessment.component').then(m => m.RiskAssessmentComponent) 
  },
  { path: 'risk-assessment', redirectTo: 'risk', pathMatch: 'full' },
  { 
    path: 'audit', 
    loadComponent: () => import('./modules/audit/audit.component').then(m => m.AuditComponent) 
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent) 
  },
  { path: '**', redirectTo: 'dashboard' }
];

