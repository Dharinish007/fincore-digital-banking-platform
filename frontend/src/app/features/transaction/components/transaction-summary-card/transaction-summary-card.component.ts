import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TransactionSummary, TransactionStatus } from '../../models/transaction.model';

interface SummaryStats {
  total:     number;
  completed: number;
  failed:    number;
  totalVolume: number;
  currency: string;
}

@Component({
  selector: 'app-transaction-summary-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatIconModule],
  template: `
    @if (stats) {
      <div class="summary-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon--primary">
            <mat-icon>receipt_long</mat-icon>
          </div>
          <div class="stat-body">
            <span class="stat-label">Total Transactions</span>
            <span class="stat-value">{{ stats.total }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-body">
            <span class="stat-label">Successful</span>
            <span class="stat-value">{{ stats.completed }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--danger">
            <mat-icon>error_outline</mat-icon>
          </div>
          <div class="stat-body">
            <span class="stat-label">Failed / Cancelled</span>
            <span class="stat-value">{{ stats.failed }}</span>
          </div>
        </div>

        <div class="stat-card stat-card--wide">
          <div class="stat-icon stat-icon--info">
            <mat-icon>payments</mat-icon>
          </div>
          <div class="stat-body">
            <span class="stat-label">Total Volume</span>
            <span class="stat-value">{{ stats.totalVolume | currency:(stats.currency || 'USD'):'symbol':'1.2-2' }}</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1rem 1.25rem;
      box-shadow: var(--shadow-xs);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);

      &:hover {
        border-color: var(--border-highlight);
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }

      &--wide {
        grid-column: span 2;
      }
    }

    .stat-icon {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      &--primary {
        background: var(--primary-transparent);
        border: 1px solid var(--primary-light);
        mat-icon { color: var(--primary-hover); }
      }

      &--success {
        background: var(--success-bg);
        border: 1px solid var(--success-border);
        mat-icon { color: var(--success); }
      }

      &--danger {
        background: var(--danger-bg);
        border: 1px solid var(--danger-border);
        mat-icon { color: var(--danger); }
      }

      &--info {
        background: var(--info-bg);
        border: 1px solid var(--info-border);
        mat-icon { color: var(--info); }
      }
    }

    .stat-body {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .stat-value {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
      letter-spacing: -0.3px;
      font-variant-numeric: tabular-nums;
    }

    .stat-label {
      font-size: 0.725rem;
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @media (max-width: 640px) {
      .stat-card--wide { grid-column: span 1; }
    }
  `]
})
export class TransactionSummaryCardComponent {
  @Input({ required: true }) set transactions(txns: TransactionSummary[]) {
    this.stats = {
      total:       txns.length,
      completed:   txns.filter(t => (t.status as string) === TransactionStatus.SUCCESS || (t.status as string) === 'COMPLETED').length,
      failed:      txns.filter(t => (t.status as string) === TransactionStatus.FAILED || (t.status as string) === 'CANCELLED').length,
      totalVolume: txns.reduce((sum, t) => sum + t.amount, 0),
      currency:    txns[0]?.currency ?? 'USD'
    };
  }

  stats: SummaryStats | null = null;
}
