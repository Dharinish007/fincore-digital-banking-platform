import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CustomerListComponent } from './features/customers/customer-list/customer-list.component';
import { AccountListComponent } from './features/accounts/account-list/account-list.component';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { LoanDashboardComponent } from './features/loans/loan-dashboard/loan-dashboard.component';
import { EmiCalculatorComponent } from './features/loans/emi-calculator/emi-calculator.component';
import { PaymentDashboardComponent } from './features/payments/payment-dashboard/payment-dashboard.component';
import { SendMoneyWizardComponent } from './features/payments/send-money-wizard/send-money-wizard.component';
import { BeneficiaryListComponent } from './features/beneficiaries/beneficiary-list/beneficiary-list.component';
import { KycVerificationComponent } from './features/kyc/kyc-verification/kyc-verification.component';
import { FraudDashboardComponent } from './features/fraud/fraud-dashboard/fraud-dashboard.component';
import { RiskAssessmentComponent } from './features/risk/risk-assessment/risk-assessment.component';
import { AuditLogsComponent } from './features/audit/audit-logs/audit-logs.component';
import { NotificationCenterComponent } from './features/notifications/notification-center/notification-center.component';
import { UserManagementComponent } from './features/users/user-management/user-management.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	{
		path: '',
		component: MainLayoutComponent,
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'customers', component: CustomerListComponent },
			{ path: 'accounts', component: AccountListComponent },
			{ path: 'transactions', component: TransactionListComponent },
			{ path: 'loans', component: LoanDashboardComponent },
			{ path: 'emi-calculator', component: EmiCalculatorComponent },
			{ path: 'payments', component: PaymentDashboardComponent },
			{ path: 'payments/send', component: SendMoneyWizardComponent },
			{ path: 'beneficiaries', component: BeneficiaryListComponent },
			{ path: 'kyc', component: KycVerificationComponent },
			{ path: 'fraud', component: FraudDashboardComponent },
			{ path: 'risk-assessment', component: RiskAssessmentComponent },
			{ path: 'audit', component: AuditLogsComponent },
			{ path: 'notifications', component: NotificationCenterComponent },
			{ path: 'users', component: UserManagementComponent },
			{ path: 'statement', redirectTo: 'transactions', pathMatch: 'full' },
			{ path: 'architecture/:section', redirectTo: 'dashboard' },
			{ path: 'settings', redirectTo: 'dashboard', pathMatch: 'full' }
		]
	},
	{ path: '**', redirectTo: 'dashboard' }
];
