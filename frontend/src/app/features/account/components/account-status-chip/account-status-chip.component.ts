import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountStatus, AccountType } from '../../models/account.model';

@Component({
  selector: 'app-account-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="acc-chip" [ngClass]="'chip-' + statusClass">
      <span class="chip-dot" aria-hidden="true"></span>
      {{ label }}
    </span>
  `,
  styles: [`
    .acc-chip {
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

    .chip-active    { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success-border); }
    .chip-inactive  { background: var(--color-background-subtle); color: var(--color-text-muted); border: 1px solid var(--color-border); }
    .chip-blocked   { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger-border); }
    .chip-closed    { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger-border); }
    .chip-savings   { background: var(--color-primary-light); color: var(--color-primary); border: 1px solid var(--color-primary-subtle); }
    .chip-current   { background: var(--color-accent-light); color: var(--color-accent); border: 1px solid var(--color-accent-subtle); }
    .chip-fixed-deposit { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning-border); }
    .chip-recurring-deposit { background: var(--color-info-bg); color: var(--color-info); border: 1px solid var(--color-info-border); }
  `]
})
export class AccountStatusChipComponent {
  @Input({ required: true }) value!: AccountStatus | AccountType | string;

  get label(): string {
    return (this.value || '').replace(/_/g, ' ');
  }

  get statusClass(): string {
    return (this.value || '').toLowerCase().replace(/_/g, '-');
  }
}
