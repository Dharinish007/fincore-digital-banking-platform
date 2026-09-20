import { Routes } from '@angular/router';
import { KycShellComponent } from './shared/components/kyc-shell/kyc-shell.component';
import { CreditShellComponent } from './features/credit-check/components/credit-shell/credit-shell.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // ============================================================
  // OVERVIEW & DASHBOARD (Team B)
  // ============================================================
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./modules/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'core-dashboard',
    loadComponent: () =>
      import('./modules/core-dashboard/core-dashboard.component').then(
        (m) => m.CoreDashboardComponent,
      ),
  },

  // ============================================================
  // CORE BANKING & ACCOUNTS (Team B & Team C)
  // ============================================================
  {
    path: 'balance-accuracy',
    loadComponent: () =>
      import('./features/balance-accuracy/components/balance-accuracy-dashboard.component').then(
        (m) => m.BalanceAccuracyDashboardComponent,
      ),
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./modules/account-lifecycle/account-lifecycle').then(
        (m) => m.AccountLifecycleComponent,
      ),
  },
  {
    path: 'open-account',
    loadComponent: () =>
      import('./features/balance-accuracy/components/open-account/open-account.component').then(
        (m) => m.OpenAccountComponent,
      ),
  },
  {
    path: 'accounts/open',
    redirectTo: 'open-account',
    pathMatch: 'full',
  },
  {
    path: 'balance',
    loadComponent: () =>
      import('./modules/balance-management/balance-management').then(
        (m) => m.BalanceManagementComponent,
      ),
  },
  {
    path: 'ledger',
    loadComponent: () =>
      import('./modules/accounts-ledger/accounts.component').then(
        (m) => m.AccountsLedgerComponent,
      ),
  },
  {
    path: 'accounts-ledger',
    redirectTo: 'ledger',
    pathMatch: 'full',
  },
  {
    path: 'statements',
    loadComponent: () =>
      import('./modules/statements/statements.component').then(
        (m) => m.StatementsComponent,
      ),
  },

  // ============================================================
  // TRANSACTIONS & TRANSFERS (Team C)
  // ============================================================
  {
    path: 'fund-transfer',
    loadComponent: () =>
      import('./features/balance-accuracy/components/transfer/transfer.component').then(
        (m) => m.TransferComponent,
      ),
  },
  {
    path: 'transfer',
    redirectTo: 'fund-transfer',
    pathMatch: 'full',
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/components/transaction-dashboard/transaction-dashboard.component').then(
        (m) => m.TransactionDashboardComponent,
      ),
  },
  {
    path: 'transactions/history',
    loadComponent: () =>
      import('./features/transactions/components/transaction-history/transaction-history.component').then(
        (m) => m.TransactionHistoryComponent,
      ),
  },
  {
    path: 'transactions/details/:id',
    loadComponent: () =>
      import('./features/transactions/components/transaction-details/transaction-details.component').then(
        (m) => m.TransactionDetailsComponent,
      ),
  },
  {
    path: 'transactions/confirm',
    loadComponent: () =>
      import('./features/transactions/components/transaction-confirmation/transaction-confirmation.component').then(
        (m) => m.TransactionConfirmationComponent,
      ),
  },
  {
    path: 'transactions/status/:id',
    loadComponent: () =>
      import('./features/transactions/components/transaction-status/transaction-status.component').then(
        (m) => m.TransactionStatusComponent,
      ),
  },

  // ============================================================
  // PAYMENTS & INTERBANK SETTLEMENT (Team B & Team C)
  // ============================================================
  {
    path: 'payment-initiation',
    loadComponent: () =>
      import('./features/payments/payment-initiation/payment-initiation.component').then(
        (m) => m.PaymentInitiationComponent,
      ),
  },
  {
    path: 'payments',
    redirectTo: 'payment-initiation',
    pathMatch: 'full',
  },
  {
    path: 'payment-review',
    loadComponent: () =>
      import('./features/payments/payment-review/payment-review.component').then(
        (m) => m.PaymentReviewComponent,
      ),
  },
  {
    path: 'beneficiary-verification',
    loadComponent: () =>
      import('./features/payments/beneficiary-verification/beneficiary-verification.component').then(
        (m) => m.BeneficiaryVerificationComponent,
      ),
  },
  {
    path: 'settlement',
    loadComponent: () =>
      import('./modules/settlement-engine/settlement-engine.component').then(
        (m) => m.SettlementEngineComponent,
      ),
  },
  {
    path: 'settlement-engine',
    redirectTo: 'settlement',
    pathMatch: 'full',
  },

  // ============================================================
  // LENDING & CREDIT SUITE (Team B & Team C)
  // ============================================================
  {
    path: 'loans',
    loadComponent: () =>
      import('./modules/loans/loans.component').then(
        (m) => m.LoansComponent,
      ),
    data: { tab: 'SERVICING' },
  },
  {
    path: 'loans/emi',
    loadComponent: () =>
      import('./modules/loans/loans.component').then(
        (m) => m.LoansComponent,
      ),
    data: { tab: 'EMI' },
  },
  {
    path: 'loans/disbursement',
    loadComponent: () =>
      import('./modules/loans/loans.component').then(
        (m) => m.LoansComponent,
      ),
    data: { tab: 'DISBURSEMENT' },
  },
  {
    path: 'loans/collections',
    loadComponent: () =>
      import('./modules/loans/loans.component').then(
        (m) => m.LoansComponent,
      ),
    data: { tab: 'COLLECTIONS' },
  },
  {
    path: 'loan-origination',
    loadChildren: () =>
      import('./features/loan-origination/loan-origination.module').then(
        (m) => m.LoanOriginationModule,
      ),
  },
  {
    path: '',
    component: CreditShellComponent,
    children: [
      {
        path: 'credit-check',
        loadComponent: () =>
          import('./features/credit-check/components/dashboard/credit-check-dashboard.component').then(
            (m) => m.CreditCheckDashboardComponent,
          ),
      },
      {
        path: 'credit-check/new',
        loadComponent: () =>
          import('./features/credit-check/components/new-check/credit-check-form.component').then(
            (m) => m.CreditCheckFormComponent,
          ),
      },
      {
        path: 'emi-calculator',
        loadComponent: () =>
          import('./features/emi-calculator/emi-calculator.component').then(
            (m) => m.EmiCalculatorComponent,
          ),
      },
    ],
  },
  {
    path: 'pre-qualification',
    redirectTo: 'loan-origination/pre-qualification',
    pathMatch: 'full',
  },
  {
    path: 'loan-application',
    redirectTo: 'loan-origination/loan-application',
    pathMatch: 'full',
  },
  {
    path: 'applications',
    redirectTo: 'loan-origination/applications',
    pathMatch: 'full',
  },

  // ============================================================
  // FRAUD DETECTION & RISK (Team B & Team C)
  // ============================================================
  {
    path: 'fraud-detection',
    loadComponent: () =>
      import('./modules/fraud-detection/fraud-detection.component').then(
        (m) => m.FraudDetectionComponent,
      ),
  },
  {
    path: 'fraud-check',
    loadComponent: () =>
      import('./features/payments/fraud-check/fraud-check.component').then(
        (m) => m.FraudCheckComponent,
      ),
  },
  {
    path: 'risk',
    loadComponent: () =>
      import('./modules/risk-assessment/risk-assessment.component').then(
        (m) => m.RiskAssessmentComponent,
      ),
  },
  {
    path: 'risk-assessment',
    redirectTo: 'risk',
    pathMatch: 'full',
  },

  // ============================================================
  // IDENTITY & AI KYC SUITE (Team B & Team C)
  // ============================================================
  {
    path: 'liveness',
    loadComponent: () =>
      import('./modules/kyc/kyc.component').then(
        (m) => m.KycComponent,
      ),
  },
  {
    path: 'kyc',
    redirectTo: 'liveness',
    pathMatch: 'full',
  },
  {
    path: '',
    component: KycShellComponent,
    children: [
      {
        path: 'document-ocr',
        loadComponent: () =>
          import('./features/document-ocr/document-ocr.component').then(
            (m) => m.DocumentOcrComponent,
          ),
      },
      {
        path: 'liveness-detection',
        loadComponent: () =>
          import('./features/liveness-detection/liveness-detection.component').then(
            (m) => m.LivenessDetectionComponent,
          ),
      },
      {
        path: 'face-match',
        loadComponent: () =>
          import('./pages/face-match/face-match.component').then(
            (m) => m.FaceMatchComponent,
          ),
      },
      {
        path: 'verification-summary',
        loadComponent: () =>
          import('./pages/verification-summary/verification-summary.component').then(
            (m) => m.VerificationSummaryComponent,
          ),
      },
    ],
  },

  // ============================================================
  // NOTIFICATIONS, AUDIT & SYSTEM (Team B)
  // ============================================================
  {
    path: 'notifications',
    loadComponent: () =>
      import('./modules/notification-service/notification-service.component').then(
        (m) => m.NotificationServiceComponent,
      ),
  },
  {
    path: 'notification-service',
    redirectTo: 'notifications',
    pathMatch: 'full',
  },
  {
    path: 'audit',
    loadComponent: () =>
      import('./modules/audit/audit.component').then(
        (m) => m.AuditComponent,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./modules/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
  },

  // Wildcard fallback
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
