import { Routes } from '@angular/router';
import { KycShellComponent } from './shared/components/kyc-shell/kyc-shell.component';
import { CreditShellComponent } from './features/credit-check/components/credit-shell/credit-shell.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'balance-accuracy',
    pathMatch: 'full',
  },

  // ==========================================
  // CORE BANKING MODULES (Milestone 1)
  // ==========================================
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
      import('./features/balance-accuracy/components/open-account/open-account.component').then(
        (m) => m.OpenAccountComponent,
      ),
  },
  {
    path: 'open-account',
    redirectTo: 'accounts',
    pathMatch: 'full',
  },
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

  // ==========================================
  // PAYMENTS & TRANSFERS MODULES (Milestone 3)
  // ==========================================
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
    path: 'fraud-check',
    loadComponent: () =>
      import('./features/payments/fraud-check/fraud-check.component').then(
        (m) => m.FraudCheckComponent,
      ),
  },

  // ==========================================
  // LOANS & CREDIT RISK MODULES (Milestone 2)
  // ==========================================
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

  // ==========================================
  // KYC & IDENTITY SUITE (Milestone 4)
  // ==========================================
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

  // Wildcard fallback
  {
    path: '**',
    redirectTo: 'balance-accuracy',
  },
];
