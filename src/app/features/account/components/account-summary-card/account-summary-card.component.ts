import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Account } from '../../models/account.model';
import { AccountStatusChipComponent } from '../account-status-chip/account-status-chip.component';

@Component({
  selector: 'app-account-summary-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, MatIconModule, MatButtonModule, AccountStatusChipComponent],
  template: `
    @if (account) {
      <div class="summary-card">
        <div class="card-header">
          <div class="card-icon">
            <mat-icon>{{ getTypeIcon() }}</mat-icon>
          </div>
          <div class="card-meta">
            <p class="acc-number">{{ account.accountNumber }}</p>
            <div class="chip-row">
              <app-account-status-chip [value]="account.accountType"></app-account-status-chip>
              <app-account-status-chip [value]="account.status"></app-account-status-chip>
            </div>
          </div>
        </div>
        <div class="balance-display">
          <p class="balance-label">Available Balance</p>
          <p class="balance-amount">{{ account.availableBalance | currency:account.currency:'symbol':'1.2-2' }}</p>
          <p class="balance-sub">Total: {{ account.balance | currency:account.currency:'symbol':'1.2-2' }}</p>
        </div>
        <div class="card-footer">
          <span>{{ account.branch }} Branch</span>
          <a mat-button color="primary" [routerLink]="['/account', account.id]">
            View <mat-icon>chevron_right</mat-icon>
          </a>
        </div>
      </div>
    }
  `,
  styles: [`
    .summary-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }
    .card-header { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
    .card-icon {
      width: 44px; height: 44px; border-radius: var(--radius-md);
      background: var(--accent-light); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
    }
    .card-meta { flex: 1; }
    .acc-number { font-family: monospace; font-weight: 600; color: var(--text-primary); margin: 0 0 6px; font-size: 0.9rem; }
    .chip-row { display: flex; gap: 6px; flex-wrap: wrap; }
    .balance-display {
      background: linear-gradient(135deg, var(--primary-dark, #0f172a), var(--primary, #1e293b));
      border-radius: var(--radius-md); padding: 16px; color: #fff; margin-bottom: 16px;
      .balance-label { font-size: 0.75rem; color: rgba(255,255,255,0.7); margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
      .balance-amount { font-size: 1.5rem; font-weight: 700; margin: 0 0 4px; }
      .balance-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin: 0; }
    }
    .card-footer {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 0.85rem; color: var(--text-muted);
    }
  `]
})
export class AccountSummaryCardComponent {
  @Input({ required: true }) account!: Account | undefined;

  getTypeIcon(): string {
    switch(this.account?.accountType) {
      case 'SAVINGS': return 'savings';
      case 'CHECKING': return 'account_balance_wallet';
      case 'CURRENT': return 'business_center';
      case 'FIXED_DEPOSIT': return 'lock_clock';
      default: return 'account_balance';
    }
  }
}
