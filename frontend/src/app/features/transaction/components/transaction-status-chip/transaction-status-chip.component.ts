import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionStatus, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="txn-chip" [ngClass]="chipClass">
      <span class="chip-dot" aria-hidden="true"></span>
      {{ label }}
    </span>
  `,
  styles: [`
    .txn-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 9px;
      font-size: 0.725rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      border-radius: var(--radius-full);
      white-space: nowrap;
      line-height: 1.2;
    }

    .chip-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    /* Status chips */
    .chip-success,
    .chip-completed  { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success-border); }
    .chip-pending    { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning-border); }
    .chip-failed     { background: var(--color-danger-bg);  color: var(--color-danger); border: 1px solid var(--color-danger-border); }
    .chip-cancelled  { background: var(--color-background-subtle); color: var(--color-text-muted); border: 1px solid var(--color-border); }

    /* Type chips */
    .chip-deposit    { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success-border); }
    .chip-withdrawal { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger-border); }
    .chip-transfer   { background: var(--color-primary-light); color: var(--color-primary); border: 1px solid var(--color-primary-subtle); }
    .chip-payment    { background: var(--color-accent-light); color: var(--color-accent); border: 1px solid var(--color-accent-subtle); }
    .chip-fee        { background: var(--color-background-subtle); color: var(--color-text-secondary); border: 1px solid var(--color-border); }
  `]
})
export class TransactionStatusChipComponent {
  @Input({ required: true }) value!: TransactionStatus | TransactionType | string;

  get chipClass(): string {
    return 'chip-' + (this.value || '').toLowerCase();
  }

  get label(): string {
    const val = this.value || '';
    return val.charAt(0) + val.slice(1).toLowerCase();
  }
}
