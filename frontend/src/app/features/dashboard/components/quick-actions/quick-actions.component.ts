import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { QuickAction } from '../../models/dashboard.model';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-dashboard-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatRippleModule],
  template: `
    <div class="quick-actions-list">
      @for (action of actions; track action.label) {
        <button
          type="button"
          (click)="onActionClick(action)"
          class="action-btn"
          [ngClass]="getActionToneClass(action.route)"
          matRipple
        >
          <div class="action-icon-box">
            <mat-icon>{{ action.icon }}</mat-icon>
          </div>
          <div class="action-text-group">
            <span class="action-label">{{ action.label }}</span>
            <span class="action-desc">{{ getActionDescription(action.route) }}</span>
          </div>
          <mat-icon class="action-arrow">chevron_right</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [`
    .quick-actions-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      padding: 0.75rem 0.875rem;
      background: var(--color-surface-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      text-decoration: none;
      transition: all var(--transition-fast);
      gap: 0.875rem;
      cursor: pointer;
      font-family: inherit;
      width: 100%;
      text-align: left;
      
      &:hover {
        border-color: var(--color-primary);
        background: var(--color-primary-light);
        transform: translateX(2px);
        
        .action-icon-box {
          background: var(--color-primary);
          color: #ffffff;
        }

        .action-arrow {
          color: var(--color-primary);
          transform: translateX(2px);
        }
      }

      &.action-emerald {
        background: var(--color-surface-emerald);
        border-color: var(--color-surface-emerald-border);

        .action-icon-box {
          color: var(--color-primary);
          background: var(--color-surface);
          border-color: var(--color-surface-emerald-border);
        }

        &:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }
      }

      &.action-blue {
        background: var(--color-surface-blue);
        border-color: var(--color-surface-blue-border);

        .action-icon-box {
          color: var(--color-accent);
          background: var(--color-surface);
          border-color: var(--color-surface-blue-border);
        }

        &:hover {
          border-color: var(--color-accent);
          background: var(--color-accent-light);

          .action-icon-box {
            background: var(--color-accent);
            color: #ffffff;
          }

          .action-arrow {
            color: var(--color-accent);
          }
        }
      }
    }
    
    .action-icon-box {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all var(--transition-fast);
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .action-text-group {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    
    .action-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      line-height: 1.25;
    }

    .action-desc {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
      line-height: 1.3;
      margin-top: 1px;
    }

    .action-arrow {
      font-size: 18px;
      color: var(--color-text-muted);
      transition: transform var(--transition-fast), color var(--transition-fast);
      flex-shrink: 0;
    }
  `]
})
export class DashboardQuickActionsComponent {
  @Input({ required: true }) actions: QuickAction[] = [];

  private router = inject(Router);
  private notificationService = inject(NotificationService);

  getActionToneClass(route: string): string {
    switch (route) {
      case '/customer/new': return 'action-emerald';
      case '/account/new': return 'action-blue';
      case '/transaction/new': return 'action-blue';
      default: return '';
    }
  }

  getActionDescription(route: string): string {
    switch (route) {
      case '/customer/new': return 'Create new customer profile';
      case '/account/new': return 'Open savings, checking, or deposit account';
      case '/transaction/new': return 'Initiate deposit, withdrawal, or transfer';
      default: return 'Quick action shortcut';
    }
  }

  onActionClick(action: QuickAction): void {
    const validRoutes = ['/customer/new', '/account/new', '/transaction/new', '/dashboard', '/customer', '/account', '/transaction'];
    if (validRoutes.includes(action.route)) {
      this.router.navigate([action.route]);
    } else {
      this.notificationService.info(`${action.label} feature is unavailable in current release.`);
    }
  }
}
