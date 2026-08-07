import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountStatus } from '../../../core/models/account.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="'status-' + (status | lowercase)">
      <span class="dot"></span>
      <span class="label">{{ status }}</span>
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: capitalize;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    /* Verified Green */
    .status-verified {
      background-color: rgba(16, 185, 129, 0.15);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      .dot { background-color: #10B981; box-shadow: 0 0 6px rgba(16, 185, 129, 0.6); }
    }

    /* Mismatch Red */
    .status-mismatch {
      background-color: rgba(239, 68, 68, 0.15);
      color: #EF4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      .dot { background-color: #EF4444; box-shadow: 0 0 6px rgba(239, 68, 68, 0.6); }
    }

    /* Pending Orange */
    .status-pending {
      background-color: rgba(245, 158, 11, 0.15);
      color: #F59E0B;
      border: 1px solid rgba(245, 158, 11, 0.3);
      .dot { background-color: #F59E0B; box-shadow: 0 0 6px rgba(245, 158, 11, 0.6); }
    }
  `]
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: AccountStatus | string;
}
