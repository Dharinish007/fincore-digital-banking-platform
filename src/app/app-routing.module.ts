import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { InitiateTransactionPage } from './pages/initiate-transaction/initiate-transaction.page';
import { TransactionConfirmationPage } from './pages/transaction-confirmation/transaction-confirmation.page';
import { TransactionStatusPage } from './pages/transaction-status/transaction-status.page';
import { TransactionHistoryPage } from './pages/transaction-history/transaction-history.page';
import { TransactionDetailsPage } from './pages/transaction-details/transaction-details.page';
import { ReportsPage } from './pages/reports/reports.page';
import { ProfilePage } from './pages/profile/profile.page';
import { SettingsPage } from './pages/settings/settings.page';
import { SupportPage } from './pages/support/support.page';

const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'initiate-transaction', component: InitiateTransactionPage },
  { path: 'transaction-confirmation', component: TransactionConfirmationPage },
  { path: 'transaction-status', component: TransactionStatusPage },
  { path: 'transaction-status/:id', component: TransactionStatusPage },
  { path: 'transaction-history', component: TransactionHistoryPage },
  { path: 'transaction-details/:id', component: TransactionDetailsPage },
  { path: 'reports', component: ReportsPage },
  { path: 'profile', component: ProfilePage },
  { path: 'settings', component: SettingsPage },
  { path: 'support', component: SupportPage },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
