import { Routes } from '@angular/router';
import { roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'core-dashboard', 
    canActivate: [roleGuard(['ADMIN', 'BANK_STAFF'])],
    loadComponent: () => import('./modules/core-dashboard/core-dashboard.component').then(m => m.CoreDashboardComponent) 
  },
  { 
    path: 'accounts', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'BANK_STAFF', 'LOAN_OFFICER', 'FRAUD_OFFICER', 'AUDITOR'])],
    loadComponent: () => import('./modules/account-lifecycle/account-lifecycle').then(m => m.AccountLifecycleComponent) 
  },
  { 
    path: 'balance', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'BANK_STAFF'])],
    loadComponent: () => import('./modules/balance-management/balance-management').then(m => m.BalanceManagementComponent) 
  },
  { 
    path: 'statements', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'BANK_STAFF', 'AUDITOR'])],
    loadComponent: () => import('./modules/statements/statements.component').then(m => m.StatementsComponent) 
  },
  { 
    path: 'loans', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'BANK_STAFF', 'LOAN_OFFICER', 'AUDITOR'])],
    loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent),
    data: { tab: 'SERVICING' }
  },
  { 
    path: 'loans/emi', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'BANK_STAFF', 'LOAN_OFFICER'])],
    loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent),
    data: { tab: 'EMI' }
  },
  { 
    path: 'loans/disbursement', 
    canActivate: [roleGuard(['ADMIN', 'LOAN_OFFICER', 'AUDITOR'])],
    loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent),
    data: { tab: 'DISBURSEMENT' }
  },
  { 
    path: 'loans/collections', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'BANK_STAFF', 'LOAN_OFFICER', 'AUDITOR'])],
    loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent),
    data: { tab: 'COLLECTIONS' }
  },
  { 
    path: 'payments', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'BANK_STAFF'])],
    loadComponent: () => import('./modules/payments/payments.component').then(m => m.PaymentsComponent) 
  },
  { 
    path: 'settlement', 
    canActivate: [roleGuard(['ADMIN', 'FRAUD_OFFICER', 'AUDITOR'])],
    loadComponent: () => import('./modules/settlement-engine/settlement-engine.component').then(m => m.SettlementEngineComponent) 
  },
  { path: 'settlement-engine', redirectTo: 'settlement', pathMatch: 'full' },
  { 
    path: 'ledger', 
    canActivate: [roleGuard(['ADMIN', 'BANK_STAFF', 'AUDITOR'])],
    loadComponent: () => import('./modules/accounts-ledger/accounts.component').then(m => m.AccountsLedgerComponent) 
  },
  { 
    path: 'notifications', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'BANK_STAFF', 'LOAN_OFFICER', 'FRAUD_OFFICER', 'AUDITOR'])],
    loadComponent: () => import('./modules/notification-service/notification-service.component').then(m => m.NotificationServiceComponent) 
  },
  { path: 'notification-service', redirectTo: 'notifications', pathMatch: 'full' },
  { 
    path: 'liveness', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'BANK_STAFF'])],
    loadComponent: () => import('./modules/kyc/kyc.component').then(m => m.KycComponent) 
  },
  { path: 'kyc', redirectTo: 'liveness', pathMatch: 'full' },
  { 
    path: 'fraud-detection', 
    canActivate: [roleGuard(['ADMIN', 'FRAUD_OFFICER', 'AUDITOR'])],
    loadComponent: () => import('./modules/fraud-detection/fraud-detection.component').then(m => m.FraudDetectionComponent) 
  },
  { 
    path: 'risk', 
    canActivate: [roleGuard(['CUSTOMER', 'ADMIN', 'LOAN_OFFICER', 'FRAUD_OFFICER', 'AUDITOR'])],
    loadComponent: () => import('./modules/risk-assessment/risk-assessment.component').then(m => m.RiskAssessmentComponent) 
  },
  { path: 'risk-assessment', redirectTo: 'risk', pathMatch: 'full' },
  { 
    path: 'audit', 
    canActivate: [roleGuard(['ADMIN', 'AUDITOR', 'BANK_STAFF', 'FRAUD_OFFICER'])],
    loadComponent: () => import('./modules/audit/audit.component').then(m => m.AuditComponent) 
  },
  { 
    path: 'settings', 
    canActivate: [roleGuard(['ADMIN'])],
    loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent) 
  },
  { path: '**', redirectTo: 'dashboard' }
];
