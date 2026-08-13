import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { BalanceService } from '../../services/balance.service';
import { DeliveryStorageService } from '../../services/delivery-storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-view">
      <h2 class="view-title">Core Banking Operations</h2>

      <!-- Top 3 Operational Metric Boxes matching image -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="m-label">Active Accounts</div>
          <div class="m-value">2.4M</div>
          <div class="m-sub">Savings+Current</div>
        </div>

        <div class="metric-card">
          <div class="m-label">Transactions/Day</div>
          <div class="m-value">12.4M</div>
          <div class="m-sub">Real-time</div>
        </div>

        <div class="metric-card">
          <div class="m-label">Uptime</div>
          <div class="m-value">99.99%</div>
          <div class="m-sub">SLA</div>
        </div>
      </div>

      <!-- Main Account Service - Core Banking Box matching image -->
      <div class="core-banking-card">
        <div class="card-header-bar">
          <h3>Account Service - Core Banking</h3>
          <div class="header-actions-group">
            <button type="button" class="btn-transfer-quick" (click)="openTransferModalTrigger.emit()">
              🔄 Inter-Account Transfer
            </button>
            <button type="button" class="btn-edit-active" (click)="openEditModal()">
              ✏️ Edit Active Account Details
            </button>
          </div>
        </div>

        <div class="banking-details-list">
          <div class="detail-line">
            <span class="d-label">Account:</span>
            <span class="d-val font-mono">{{ accountService.maskAccountNumber(accountService.activeAccount().accountNumber) }}</span>
            <span class="d-sep">|</span>
            <span class="d-label">Type:</span>
            <span class="d-val">{{ accountService.activeAccount().type }}</span>
            <span class="d-sep">|</span>
            <span class="d-label">Balance:</span>
            <span class="d-val font-bold text-green">$ {{ accountService.activeAccount().balance.toFixed(2) }}</span>
          </div>

          <div class="detail-line">
            <span class="d-label">Customer:</span>
            <span class="d-val font-bold">{{ accountService.activeAccount().holderName }}</span>
            <span class="d-sep">|</span>
            <span class="d-label">KYC:</span>
            <span class="d-val text-green font-bold">{{ accountService.activeAccount().kycStatus }}</span>
            <span class="d-sep">|</span>
            <span class="d-label">Risk:</span>
            <span class="d-val text-blue font-bold">{{ accountService.activeAccount().riskLevel }}</span>
          </div>

          <div class="detail-line">
            <span class="d-label">Transaction:</span>
            <span class="d-val text-amber">Deposit $2,400</span>
            <span class="d-sep">|</span>
            <span class="d-val text-dim">Kafka Event Published</span>
          </div>

          <div class="detail-line">
            <span class="d-label">PostgreSQL:</span>
            <span class="d-val text-dim">ACID commit</span>
            <span class="d-sep">|</span>
            <span class="d-label">Redis:</span>
            <span class="d-val text-dim">Balance cached</span>
          </div>

          <div class="detail-line">
            <span class="d-label">Microservice:</span>
            <span class="d-val text-dim">Account Service</span>
            <span class="d-sep">|</span>
            <span class="d-label">Latency:</span>
            <span class="d-val text-green font-mono">47ms</span>
          </div>

          <div class="detail-line">
            <span class="d-label">Audit:</span>
            <span class="d-val text-dim">Logged to Audit DB</span>
            <span class="d-sep">|</span>
            <span class="d-val text-dim">Immutable</span>
          </div>

          <!-- Quick Action Buttons matching image: [View Statement] [Deposit / Transfer] [Freeze Account] -->
          <div class="detail-line actions-line">
            <span class="d-label">Action:</span>
            <div class="action-btn-group">
              <button type="button" class="action-link" (click)="goToStatements.emit()">[View Statement]</button>
              <button type="button" class="action-link" (click)="openTransferModalTrigger.emit()">[Transfer / Deposit]</button>
              <button 
                type="button" 
                class="action-link text-red" 
                (click)="toggleFreezeAccount()"
              >
                [{{ accountService.activeAccount().status === 'FROZEN' ? 'Unfreeze Account' : 'Freeze Account' }}]
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Account Switcher Grid (8 Enterprise Accounts) -->
      <div class="accounts-switcher-card">
        <h3>ACTIVE ENTERPRISE ACCOUNTS PORTFOLIO (8 ACCOUNTS)</h3>
        <div class="account-pills-grid">
          <div 
            *ngFor="let acc of accountService.accounts()" 
            class="acc-select-card"
            [class.active]="acc.id === accountService.activeAccountId()"
            (click)="accountService.selectAccount(acc.id)"
          >
            <div class="asc-top">
              <span class="asc-type">{{ acc.type }}</span>
              <span class="asc-status" [ngClass]="acc.status.toLowerCase()">● {{ acc.status }}</span>
            </div>
            <div class="asc-name">{{ acc.holderName }}</div>
            <div class="asc-no font-mono">{{ accountService.maskAccountNumber(acc.accountNumber) }}</div>
            <div class="asc-bal font-bold">$ {{ acc.balance.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-view { color: #ffffff; }
    .view-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 1.25rem; color: #ffffff; }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 1.5rem;
      max-width: 950px;
    }
    .metric-card { background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 1.25rem; }
    .m-label { font-size: 0.8rem; color: #9ca3af; margin-bottom: 0.4rem; }
    .m-value { font-size: 1.8rem; font-weight: 800; color: #ffffff; margin-bottom: 0.2rem; }
    .m-sub { font-size: 0.72rem; color: #38bdf8; }

    .core-banking-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 8px;
      padding: 1.5rem;
      max-width: 950px;
      margin-bottom: 1.5rem;
    }
    .card-header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
    .core-banking-card h3 { font-size: 1.1rem; font-weight: 700; color: #9ca3af; margin: 0; }

    .header-actions-group { display: flex; gap: 0.75rem; }
    .btn-transfer-quick {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 800;
      cursor: pointer;
    }
    .btn-edit-active {
      background: #1e293b;
      border: 1px solid #3b82f6;
      color: #60a5fa;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
    }

    .banking-details-list { display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.92rem; color: #e5e7eb; }
    .detail-line { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .d-label { color: #9ca3af; font-weight: 600; }
    .d-val { color: #f3f4f6; }
    .d-sep { color: #4b5563; margin: 0 0.2rem; }
    .text-green { color: #34d399; }
    .text-blue { color: #60a5fa; }
    .text-amber { color: #fbbf24; }
    .text-red { color: #f87171; }
    .text-dim { color: #9ca3af; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }

    .actions-line { margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #1f2937; }
    .action-btn-group { display: flex; gap: 0.75rem; }
    .action-link { background: none; border: none; color: #38bdf8; font-size: 0.92rem; font-weight: 700; cursor: pointer; padding: 0; }
    .action-link:hover { text-decoration: underline; }

    .accounts-switcher-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 8px;
      padding: 1.25rem;
      max-width: 950px;
    }
    .accounts-switcher-card h3 { font-size: 0.95rem; font-weight: 800; color: #9ca3af; margin: 0 0 1rem 0; }
    .account-pills-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.85rem; }
    .acc-select-card {
      background: #0f172a;
      border: 1px solid #1f2937;
      padding: 0.85rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .acc-select-card:hover { border-color: #3b82f6; }
    .acc-select-card.active { border-color: #38bdf8; background: rgba(56, 189, 248, 0.1); }
    .asc-top { display: flex; justify-content: space-between; font-size: 0.65rem; color: #9ca3af; margin-bottom: 0.3rem; }
    .asc-status { font-weight: 700; }
    .asc-status.active { color: #34d399; }
    .asc-status.frozen { color: #fca5a5; }
    .asc-status.dormant { color: #9ca3af; }
    .asc-name { font-size: 0.82rem; font-weight: 700; color: #ffffff; }
    .asc-no { font-size: 0.7rem; color: #6b7280; margin-bottom: 0.3rem; }
    .asc-bal { font-size: 0.95rem; color: #34d399; }
  `]
})
export class DashboardComponent {
  accountService = inject(AccountService);
  balanceService = inject(BalanceService);
  deliveryService = inject(DeliveryStorageService);

  readonly goToStatements = output<void>();
  readonly goToBalance = output<void>();
  readonly openEditModalTrigger = output<void>();
  readonly openTransferModalTrigger = output<void>();

  openEditModal() {
    this.openEditModalTrigger.emit();
  }

  toggleFreezeAccount() {
    const acc = this.accountService.activeAccount();
    const newStatus = acc.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
    this.accountService.updateAccountStatus(acc.id, newStatus);
    this.deliveryService.showToast(
      'Account Status Updated',
      `Account ${acc.accountNumber} status changed to ${newStatus}.`,
      newStatus === 'FROZEN' ? 'warning' : 'success'
    );
  }
}
