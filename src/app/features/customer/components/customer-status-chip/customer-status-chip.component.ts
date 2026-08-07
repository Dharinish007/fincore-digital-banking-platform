import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { CustomerStatus, CustomerType, KycStatus } from '../../models/customer.model';

@Component({
  selector: 'app-customer-status-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <span class="status-chip" [ngClass]="'chip-' + statusClass">
      {{ label }}
    </span>
  `,
  styles: [`
    .status-chip {
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
    .chip-active    { background: var(--success-light); color: var(--success-dark); }
    .chip-inactive  { background: var(--bg-surface-2); color: var(--text-muted); border: 1px solid var(--border-color); }
    .chip-suspended { background: var(--danger-light); color: var(--danger-dark); }
    .chip-pending   { background: var(--warning-light); color: var(--warning-dark); }
    .chip-verified  { background: var(--success-light); color: var(--success-dark); }
    .chip-rejected  { background: var(--danger-light); color: var(--danger-dark); }
    .chip-retail    { background: var(--info-light); color: var(--info-dark); }
    .chip-premium   { background: rgba(124, 58, 237, 0.12); color: #6d28d9; }
    .chip-corporate { background: rgba(15, 23, 42, 0.08); color: var(--primary); }
    .chip-sme       { background: var(--warning-light); color: var(--warning-dark); }
  `]
})
export class CustomerStatusChipComponent {
  @Input({ required: true }) value!: CustomerStatus | CustomerType | KycStatus;

  get label(): string { return this.value.replace('_', ' '); }
  get statusClass(): string { return this.value.toLowerCase(); }
}
