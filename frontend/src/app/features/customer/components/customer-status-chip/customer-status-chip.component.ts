import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerStatus, KycStatus } from '../../models/customer.model';

@Component({
  selector: 'app-customer-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-chip" [ngClass]="'chip-' + statusClass">
      <span class="chip-dot" aria-hidden="true"></span>
      {{ label }}
    </span>
  `,
  styles: [`
    .status-chip {
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

    .chip-active,
    .chip-verified  { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success-border); }
    
    .chip-pending   { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning-border); }
    
    .chip-suspended,
    .chip-rejected  { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger-border); }
    
    .chip-inactive  { background: var(--color-background-subtle); color: var(--color-text-muted); border: 1px solid var(--color-border); }
    
    .chip-retail    { background: var(--color-primary-light); color: var(--color-primary); border: 1px solid var(--color-primary-subtle); }
    .chip-premium   { background: var(--color-accent-light); color: var(--color-accent); border: 1px solid var(--color-accent-subtle); }
    .chip-corporate { background: var(--color-background-subtle); color: var(--color-text-primary); border: 1px solid var(--color-border); }
    .chip-sme       { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning-border); }
  `]
})
export class CustomerStatusChipComponent {
  @Input({ required: true }) value!: CustomerStatus | KycStatus | string;

  get label(): string { return (this.value || '').replace('_', ' '); }
  get statusClass(): string { return (this.value || '').toLowerCase(); }
}
