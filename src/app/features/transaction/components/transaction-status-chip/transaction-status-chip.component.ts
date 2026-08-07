import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionStatus, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="txn-chip" [ngClass]="chipClass">
      {{ label }}
    </span>
  `,
  styles: [`
    .txn-chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      border-radius: 999px;
      white-space: nowrap;
    }

    /* Status chips */
    .chip-completed  { background: var(--success-light); color: var(--success-dark); }
    .chip-pending    { background: var(--warning-light); color: var(--warning-dark); }
    .chip-failed     { background: var(--danger-light);  color: var(--danger-dark, #b91c1c); }
    .chip-cancelled  { background: var(--bg-surface-2);  color: var(--text-muted); border: 1px solid var(--border-color); }

    /* Type chips */
    .chip-deposit    { background: var(--success-light);     color: var(--success-dark); }
    .chip-withdrawal { background: var(--danger-light);      color: var(--danger-dark, #b91c1c); }
    .chip-transfer   { background: var(--info-light);        color: var(--info-dark); }
    .chip-payment    { background: rgba(124,58,237,0.12);    color: #6d28d9; }
    .chip-fee        { background: rgba(15,23,42,0.08);      color: var(--text-secondary); }
  `]
})
export class TransactionStatusChipComponent {
  @Input({ required: true }) value!: TransactionStatus | TransactionType;

  get chipClass(): string {
    return 'chip-' + this.value.toLowerCase();
  }

  get label(): string {
    return this.value.charAt(0) + this.value.slice(1).toLowerCase();
  }
}
