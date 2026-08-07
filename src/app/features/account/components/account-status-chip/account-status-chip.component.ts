import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountStatus, AccountType } from '../../models/account.model';

@Component({
  selector: 'app-account-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="acc-chip" [ngClass]="'chip-' + value.toLowerCase().replace('_', '-')">
      {{ value.replace('_', ' ') }}
    </span>
  `,
  styles: [`
    .acc-chip {
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
    .chip-active        { background: var(--success-light); color: var(--success-dark); }
    .chip-dormant       { background: var(--bg-surface-2); color: var(--text-muted); border: 1px solid var(--border-color); }
    .chip-closed        { background: rgba(15,23,42,0.08); color: var(--text-secondary); }
    .chip-frozen        { background: var(--info-light); color: var(--info-dark); }
    .chip-pending       { background: var(--warning-light); color: var(--warning-dark); }
    .chip-savings       { background: var(--success-light); color: var(--success-dark); }
    .chip-checking      { background: var(--accent-light); color: var(--accent-dark, var(--accent)); }
    .chip-current       { background: rgba(15,23,42,0.08); color: var(--primary); }
    .chip-fixed-deposit { background: rgba(124,58,237,0.12); color: #6d28d9; }
  `]
})
export class AccountStatusChipComponent {
  @Input({ required: true }) value!: AccountStatus | AccountType;
}
