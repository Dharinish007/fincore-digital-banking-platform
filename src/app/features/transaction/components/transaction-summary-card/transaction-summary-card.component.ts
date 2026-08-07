import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TransactionSummary, TransactionStatus } from '../../models/transaction.model';

interface SummaryStats {
  total:     number;
  completed: number;
  pending:   number;
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
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-label">Total Transactions</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-body">
            <span class="stat-value">{{ stats.completed }}</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--warning">
            <mat-icon>hourglass_top</mat-icon>
          </div>
          <div class="stat-body">
            <span class="stat-value">{{ stats.pending }}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--danger">
            <mat-icon>error_outline</mat-icon>
          </div>
          <div class="stat-body">
            <span class="stat-value">{{ stats.failed }}</span>
            <span class="stat-label">Failed / Cancelled</span>
          </div>
        </div>

        <div class="stat-card stat-card--wide">
          <div class="stat-icon stat-icon--info">
            <mat-icon>payments</mat-icon>
          </div>
          <div class="stat-body">
            <span class="stat-value">{{ stats.totalVolume | currency:'USD':'symbol':'1.2-2' }}</span>
            <span class="stat-label">Total Transaction Volume (USD)</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
      box-shadow: var(--shadow-xs);
      transition: box-shadow 0.2s ease, transform 0.2s ease;

      &:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
      &--wide  { grid-column: span 2; }
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon { font-size: 22px; width: 22px; height: 22px; }

      &--primary { background: var(--accent-light);   mat-icon { color: var(--accent); } }
      &--success { background: var(--success-light);  mat-icon { color: var(--success-dark, #15803d); } }
      &--warning { background: var(--warning-light);  mat-icon { color: var(--warning-dark, #b45309); } }
      &--danger  { background: var(--danger-light);   mat-icon { color: var(--danger-dark, #b91c1c); } }
      &--info    { background: var(--info-light);     mat-icon { color: var(--info-dark, #0369a1); } }
    }

    .stat-body {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-value {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
      font-variant-numeric: tabular-nums;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.4px;
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
      completed:   txns.filter(t => t.status === TransactionStatus.COMPLETED).length,
      pending:     txns.filter(t => t.status === TransactionStatus.PENDING).length,
      failed:      txns.filter(t => t.status === TransactionStatus.FAILED || t.status === TransactionStatus.CANCELLED).length,
      totalVolume: txns.reduce((sum, t) => sum + t.amount, 0),
      currency:    txns[0]?.currency ?? 'USD'
    };
  }

  stats: SummaryStats | null = null;
}
