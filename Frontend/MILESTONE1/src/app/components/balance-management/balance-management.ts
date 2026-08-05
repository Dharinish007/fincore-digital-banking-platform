import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BalanceService } from '../../services/balance.service';
import { PendingHold } from '../../models/banking.models';

@Component({
  selector: 'app-balance-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="balance-view">
      <div class="view-header">
        <div>
          <h2 class="view-title">BALANCE MANAGEMENT MODULE</h2>
          <div class="view-subtitle">Real-time funds tracker, deposit/withdraw engine, holds manager & overdraft controls</div>
        </div>

        <!-- Currency Selector -->
        <div class="currency-picker">
          <label>Display Currency:</label>
          <select [ngModel]="balanceService.selectedCurrency()" (ngModelChange)="onCurrencyChange($event)">
            <option *ngFor="let c of balanceService.supportedCurrencies" [value]="c.code">
              {{ c.code }} ({{ c.symbol }}) - {{ c.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Low Balance Alert Warning Banner [ngClass] -->
      <div 
        *ngIf="balanceService.isLowBalance()" 
        class="low-balance-alert-banner"
        [ngClass]="{ 'critical-alert': balanceService.availableBalance() < 0 }"
      >
        <div class="alert-icon">⚠️</div>
        <div>
          <div class="alert-title">
            {{ balanceService.availableBalance() < 0 ? 'CRITICAL OVERDRAFT WARNING' : 'MINIMUM BALANCE THRESHOLD WARNING' }}
          </div>
          <div class="alert-desc">
            Available Balance ({{ balanceService.convertBalance(balanceService.availableBalance(), balanceService.selectedCurrency()) }}) 
            is below minimum threshold of {{ balanceService.convertBalance(balanceService.minThreshold(), balanceService.selectedCurrency()) }}.
            <span *ngIf="balanceService.isOverdrawn()"> Overdraft penalty fee of $35.00 applies.</span>
          </div>
        </div>
      </div>

      <!-- Top 4 Summary Cards -->
      <div class="summary-cards-grid">
        <!-- 1. Available Balance -->
        <div class="b-card primary" [class.low-bg]="balanceService.isLowBalance()">
          <div class="b-label">AVAILABLE BALANCE</div>
          <div class="b-value text-green">
            {{ balanceService.convertBalance(balanceService.availableBalance(), balanceService.selectedCurrency()) }}
          </div>
          <div class="b-hint">Immediately spendable funds</div>
        </div>

        <!-- 2. Ledger / Current Balance -->
        <div class="b-card">
          <div class="b-label">LEDGER / CURRENT BALANCE</div>
          <div class="b-value">
            {{ balanceService.convertBalance(balanceService.ledgerBalance(), balanceService.selectedCurrency()) }}
          </div>
          <div class="b-hint">Actual settled account funds</div>
        </div>

        <!-- 3. Pending Holds Total -->
        <div class="b-card">
          <div class="b-label">PENDING HOLDS & RESERVES</div>
          <div class="b-value text-amber">
            {{ balanceService.convertBalance(balanceService.pendingHoldsTotal(), balanceService.selectedCurrency()) }}
          </div>
          <div class="b-hint">{{ balanceService.holds().length }} active authorization reserves</div>
        </div>

        <!-- 4. Overdraft Limit & Status -->
        <div class="b-card">
          <div class="b-label">OVERDRAFT CREDIT LIMIT</div>
          <div class="b-value text-blue">
            {{ balanceService.convertBalance(balanceService.overdraftLimit(), balanceService.selectedCurrency()) }}
          </div>
          <div class="b-hint">
            Status: {{ accountService.activeAccount().isOverdraftEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE' }}
          </div>
        </div>
      </div>

      <!-- Deposit & Withdraw Form Section -->
      <div class="ops-row">
        <!-- Reactive Deposit / Withdraw Form -->
        <div class="form-card">
          <h3>⚡ DEPOSIT / WITHDRAW FUNDS</h3>
          <div class="form-body">
            <div class="f-group">
              <label>Target Account:</label>
              <input type="text" class="f-input readonly" [value]="accountService.activeAccount().name + ' (' + accountService.maskAccountNumber(accountService.activeAccount().accountNumber) + ')'" readonly />
            </div>

            <div class="f-group">
              <label>Transaction Amount ($ USD):</label>
              <input type="number" [(ngModel)]="transAmount" placeholder="e.g. 500.00" class="f-input" min="1" />
            </div>

            <div class="f-group">
              <label>Description / Reference:</label>
              <input type="text" [(ngModel)]="transDesc" placeholder="e.g. Counter Cash Deposit" class="f-input" />
            </div>

            <div class="f-buttons">
              <button type="button" class="btn-deposit" (click)="executeDeposit()">
                + Deposit Funds
              </button>
              <button type="button" class="btn-withdraw" (click)="executeWithdraw()">
                - Withdraw Funds
              </button>
            </div>
          </div>
        </div>

        <!-- Holds & Reserves Manager -->
        <div class="holds-card">
          <div class="holds-header">
            <h3>PENDING HOLDS & RESERVES ENGINE</h3>
            <button type="button" class="btn-add-hold" (click)="showAddHold = !showAddHold">
              + Add Reserved Hold
            </button>
          </div>

          <!-- Add Hold Form -->
          <div class="add-hold-box" *ngIf="showAddHold">
            <div class="ah-inputs">
              <input type="text" [(ngModel)]="newHoldDesc" placeholder="Hold reason (e.g. Gas Station)" class="f-input sm" />
              <input type="number" [(ngModel)]="newHoldAmt" placeholder="Amount ($)" class="f-input sm" />
              <select [(ngModel)]="newHoldType" class="f-input sm">
                <option value="CARD_AUTHORIZATION">Card Authorization</option>
                <option value="SECURITY_DEPOSIT">Security Deposit</option>
                <option value="UNCLEARED_CHECK">Uncleared Check</option>
              </select>
            </div>
            <button type="button" class="btn-save-hold" (click)="submitHold()">Save Hold</button>
          </div>

          <!-- Holds Table -->
          <div class="holds-table-wrapper">
            <table class="holds-table">
              <thead>
                <tr>
                  <th>Hold Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let h of balanceService.holds()">
                  <td class="font-bold">{{ h.description }}</td>
                  <td><span class="hold-chip">{{ h.holdType }}</span></td>
                  <td class="text-amber font-mono font-bold">$ {{ h.amount.toFixed(2) }}</td>
                  <td>
                    <span class="status-dot" [class.active]="h.status === 'ACTIVE_HOLD'"></span>
                    {{ h.status }}
                  </td>
                  <td>
                    <button 
                      *ngIf="h.status === 'ACTIVE_HOLD'"
                      type="button" 
                      class="btn-release" 
                      (click)="balanceService.releaseHold(h.id)"
                    >
                      Release
                    </button>
                  </td>
                </tr>
                <tr *ngIf="balanceService.holds().length === 0">
                  <td colspan="5" class="empty-holds">No active pending holds on this account.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .balance-view {
      color: #ffffff;
    }
    .view-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .view-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
    }
    .view-subtitle {
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .currency-picker {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .currency-picker select {
      background: #0f172a;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .low-balance-alert-banner {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fde047;
      padding: 0.85rem 1.25rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .low-balance-alert-banner.critical-alert {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
    .alert-icon { font-size: 1.5rem; }
    .alert-title { font-weight: 800; font-size: 0.9rem; }
    .alert-desc { font-size: 0.78rem; }

    .summary-cards-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .b-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 10px;
      padding: 1.25rem;
    }
    .b-card.primary {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), #111827);
      border-color: rgba(16, 185, 129, 0.4);
    }
    .b-card.low-bg {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), #111827);
      border-color: rgba(239, 68, 68, 0.4);
    }
    .b-label {
      font-size: 0.7rem;
      font-weight: 800;
      color: #9ca3af;
      margin-bottom: 0.4rem;
    }
    .b-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.2rem;
    }
    .b-hint {
      font-size: 0.68rem;
      color: #6b7280;
    }
    .text-green { color: #34d399; }
    .text-amber { color: #fbbf24; }
    .text-blue { color: #60a5fa; }

    .ops-row {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 1.5rem;
    }
    .form-card, .holds-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 10px;
      padding: 1.25rem;
    }
    .form-card h3, .holds-card h3 {
      font-size: 0.95rem;
      font-weight: 800;
      color: #f3f4f6;
      margin: 0 0 1rem 0;
    }
    .form-body {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .f-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .f-group label {
      font-size: 0.72rem;
      font-weight: 700;
      color: #9ca3af;
    }
    .f-input {
      background: #1f2937;
      border: 1px solid #374151;
      color: #ffffff;
      padding: 0.55rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
    }
    .f-input.readonly { background: #0f172a; color: #94a3b8; }
    .f-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .btn-deposit {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      padding: 0.6rem;
      border-radius: 6px;
      font-weight: 800;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-withdraw {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #ffffff;
      border: none;
      padding: 0.6rem;
      border-radius: 6px;
      font-weight: 800;
      font-size: 0.8rem;
      cursor: pointer;
    }

    .holds-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .btn-add-hold {
      background: #1e293b;
      border: 1px solid #3b82f6;
      color: #60a5fa;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
    }
    .add-hold-box {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 0.85rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .ah-inputs {
      display: grid;
      grid-template-columns: 1fr 100px 140px;
      gap: 0.5rem;
    }
    .f-input.sm { padding: 0.35rem 0.5rem; font-size: 0.78rem; }
    .btn-save-hold {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 0.4rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.78rem;
      cursor: pointer;
      align-self: flex-end;
    }

    .holds-table-wrapper {
      overflow-x: auto;
    }
    .holds-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.78rem;
    }
    .holds-table th {
      background: #1f2937;
      color: #9ca3af;
      padding: 0.5rem 0.75rem;
      text-align: left;
      font-size: 0.7rem;
    }
    .holds-table td {
      padding: 0.6rem 0.75rem;
      border-bottom: 1px solid #1f2937;
      color: #e5e7eb;
    }
    .hold-chip {
      background: rgba(245, 158, 11, 0.15);
      color: #fde047;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.65rem;
    }
    .btn-release {
      background: #1e293b;
      border: 1px solid #10b981;
      color: #34d399;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      cursor: pointer;
    }
    .empty-holds {
      text-align: center;
      padding: 1.5rem;
      color: #6b7280;
    }

    @media (max-width: 1100px) {
      .summary-cards-grid { grid-template-columns: repeat(2, 1fr); }
      .ops-row { grid-template-columns: 1fr; }
    }
  `]
})
export class BalanceManagementComponent {
  accountService = inject(AccountService);
  balanceService = inject(BalanceService);

  transAmount: number | null = null;
  transDesc = '';

  showAddHold = false;
  newHoldDesc = '';
  newHoldAmt: number | null = null;
  newHoldType: PendingHold['holdType'] = 'CARD_AUTHORIZATION';

  onCurrencyChange(code: string) {
    this.balanceService.selectedCurrency.set(code);
  }

  executeDeposit() {
    if (!this.transAmount || this.transAmount <= 0) return;
    this.balanceService.deposit(this.transAmount, this.transDesc || 'Deposit');
    this.transAmount = null;
    this.transDesc = '';
  }

  executeWithdraw() {
    if (!this.transAmount || this.transAmount <= 0) return;
    this.balanceService.withdraw(this.transAmount, this.transDesc || 'Withdrawal');
    this.transAmount = null;
    this.transDesc = '';
  }

  submitHold() {
    if (!this.newHoldDesc || !this.newHoldAmt || this.newHoldAmt <= 0) return;
    this.balanceService.addHold(this.newHoldDesc, this.newHoldAmt, this.newHoldType);
    this.newHoldDesc = '';
    this.newHoldAmt = null;
    this.showAddHold = false;
  }
}
