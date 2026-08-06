import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header';
import { SidebarComponent, NavTab } from './components/sidebar/sidebar';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AccountLifecycleComponent } from './components/account-lifecycle/account-lifecycle';
import { BalanceManagementComponent } from './components/balance-management/balance-management';
import { FilterPanelComponent } from './components/filter-panel/filter-panel';
import { FinancialSummaryComponent } from './components/financial-summary/financial-summary';
import { TransactionTableComponent } from './components/transaction-table/transaction-table';
import { StatementPreviewModalComponent } from './components/statement-preview-modal/statement-preview-modal';
import { EmailModalComponent } from './components/email-modal/email-modal';
import { ArchivalHistoryComponent } from './components/archival-history/archival-history';
import { EditAccountModalComponent } from './components/edit-account-modal/edit-account-modal';
import { TransferModalComponent } from './components/transfer-modal/transfer-modal';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { DeliveryStorageService } from './services/delivery-storage.service';
import { AccountService } from './services/account.service';
import { AdminAuthService } from './services/admin-auth.service';

export type ThemeMode = 'NIGHT' | 'DAY';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    AccountLifecycleComponent,
    BalanceManagementComponent,
    FilterPanelComponent,
    FinancialSummaryComponent,
    TransactionTableComponent,
    StatementPreviewModalComponent,
    EmailModalComponent,
    ArchivalHistoryComponent,
    EditAccountModalComponent,
    TransferModalComponent,
    AdminLoginComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  deliveryService = inject(DeliveryStorageService);
  accountService = inject(AccountService);
  authService = inject(AdminAuthService);

  readonly currentTab = signal<NavTab>('DASHBOARD');
  readonly isPreviewModalOpen = signal<boolean>(false);
  readonly isEmailModalOpen = signal<boolean>(false);
  readonly isTransferModalOpen = signal<boolean>(false);
  readonly editingAccountId = signal<string | null>(null);

  readonly themeMode = signal<ThemeMode>('NIGHT');
  readonly isDrawerOpen = signal<boolean>(false);

  setTab(tab: NavTab) {
    this.currentTab.set(tab);
    this.isDrawerOpen.set(false);
  }

  toggleTheme(mode: ThemeMode) {
    this.themeMode.set(mode);
    this.deliveryService.showToast(
      'Theme Updated',
      `Switched application mode to ${mode === 'DAY' ? 'Day Light Mode ☀️' : 'Night Dark Mode 🌙'}.`,
      'info'
    );
  }

  toggleDrawer() {
    this.isDrawerOpen.update(v => !v);
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
  }

  logoutAdmin() {
    this.authService.logout();
    this.deliveryService.showToast('Session Ended', 'Logged out of admin session.', 'info');
  }

  openPreviewModal() {
    this.isPreviewModalOpen.set(true);
  }

  closePreviewModal() {
    this.isPreviewModalOpen.set(false);
  }

  openEmailModal() {
    this.isEmailModalOpen.set(true);
  }

  closeEmailModal() {
    this.isEmailModalOpen.set(false);
  }

  openTransferModal() {
    this.isTransferModalOpen.set(true);
  }

  closeTransferModal() {
    this.isTransferModalOpen.set(false);
  }

  openEditAccountModal(accountId?: string) {
    this.editingAccountId.set(accountId || this.accountService.activeAccountId());
  }

  closeEditAccountModal() {
    this.editingAccountId.set(null);
  }
}
