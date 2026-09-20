import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'suspended'
  | 'verified'
  | 'unverified'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'default';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="'badge-' + normalizedStatus">
      <span class="badge-dot" aria-hidden="true"></span>
      {{ label }}
    </span>
  `,
  styles: [`
    .status-badge {
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
      transition: background-color var(--transition-fast), color var(--transition-fast);
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }
    
    /* Positive / Verified / Active / Success */
    .badge-active,
    .badge-verified,
    .badge-completed,
    .badge-success {
      background: var(--color-success-bg);
      color: var(--color-success);
      border: 1px solid var(--color-success-border);
    }
    
    /* Warning / Pending / Attention */
    .badge-pending,
    .badge-unverified,
    .badge-warning {
      background: var(--color-warning-bg);
      color: var(--color-warning);
      border: 1px solid var(--color-warning-border);
    }
    
    /* Danger / Failed / Suspended / Error */
    .badge-failed,
    .badge-suspended,
    .badge-danger {
      background: var(--color-danger-bg);
      color: var(--color-danger);
      border: 1px solid var(--color-danger-border);
    }
    
    /* Info / Processing */
    .badge-processing,
    .badge-info {
      background: var(--color-info-bg);
      color: var(--color-info);
      border: 1px solid var(--color-info-border);
    }
    
    /* Neutral / Inactive / Default */
    .badge-inactive,
    .badge-default {
      background: var(--color-background-subtle);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
    }
  `]
})
export class StatusBadgeComponent {
  @Input({ required: true }) label!: string;
  @Input() status: BadgeStatus | string = 'default';

  get normalizedStatus(): string {
    return (this.status || 'default').toLowerCase().replace(/_/g, '-');
  }
}
