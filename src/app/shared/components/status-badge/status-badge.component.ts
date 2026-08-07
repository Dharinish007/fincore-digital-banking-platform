import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'default';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="'badge-' + status">
      {{ label }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: var(--radius-full);
      white-space: nowrap;
    }
    
    .badge-success {
      background: var(--success-light);
      color: var(--success-dark);
    }
    
    .badge-warning {
      background: var(--warning-light);
      color: var(--warning-dark);
    }
    
    .badge-danger {
      background: var(--danger-light);
      color: var(--danger-dark);
    }
    
    .badge-info {
      background: var(--info-light);
      color: var(--info-dark);
    }
    
    .badge-default {
      background: var(--bg-surface-2);
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
    }
  `]
})
export class StatusBadgeComponent {
  @Input({ required: true }) label!: string;
  @Input() status: BadgeStatus = 'default';
}
