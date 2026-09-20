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
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      box-shadow: var(--shadow-sm);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

      &:hover {
        border-color: var(--color-border-strong);
        box-shadow: var(--shadow-md);
      }
    }
    
    .card-header {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }
    
    .card-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--color-primary-light);
      border: 1px solid var(--color-primary-subtle);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }
    
    .card-meta {
      flex: 1;
    }
    
    .acc-number {
      font-family: var(--font-family-mono);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 4px;
      font-size: 0.85rem;
    }
    
    .chip-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    
    .balance-display {
      background: var(--color-surface-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1rem;
      color: var(--color-text-primary);
      margin-bottom: 1rem;
      
      .balance-label {
        font-size: 0.7rem;
        color: var(--color-text-muted);
        margin: 0 0 2px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }
      
      .balance-amount {
        font-size: 1.35rem;
        font-weight: 700;
        margin: 0 0 2px;
        color: var(--color-success);
        font-variant-numeric: tabular-nums;
      }
      
      .balance-sub {
        font-size: 0.775rem;
        color: var(--color-text-secondary);
        margin: 0;
      }
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--color-text-muted);

      a {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 0.8rem;
        font-weight: 600;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
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
