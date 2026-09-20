import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Notification } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-notification-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="notification-list">
      @for (notification of notifications; track notification.id) {
        <div class="notification-item" [class.unread]="!notification.read">
          <div class="notification-icon" [ngClass]="'icon-' + notification.type">
            <mat-icon>{{ getIcon(notification.type) }}</mat-icon>
          </div>
          <div class="notification-content">
            <div class="notification-header">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <span class="notification-time">{{ formatTime(notification.date) }}</span>
            </div>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
        </div>
      }
      @if (notifications.length === 0) {
        <div class="empty-state">
          <span class="material-icons-round">check_circle</span>
          <p>All system alerts resolved.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .notification-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.65rem;
      border-radius: var(--radius-sm);
      background: var(--color-background-subtle);
      border: 1px solid var(--color-border);
      transition: background-color var(--transition-fast);
      
      &:hover {
        background: var(--color-surface-hover);
      }

      &.unread {
        border-left: 3px solid var(--color-primary);
      }
    }
    
    .notification-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
      
      &.icon-info {
        background: var(--color-info-bg);
        color: var(--color-info);
        border: 1px solid var(--color-info-border);
      }
      
      &.icon-success {
        background: var(--color-success-bg);
        color: var(--color-success);
        border: 1px solid var(--color-success-border);
      }
      
      &.icon-warning {
        background: var(--color-warning-bg);
        color: var(--color-warning);
        border: 1px solid var(--color-warning-border);
      }
      
      &.icon-alert {
        background: var(--color-danger-bg);
        color: var(--color-danger);
        border: 1px solid var(--color-danger-border);
      }
    }
    
    .notification-content {
      flex: 1;
      min-width: 0;
    }
    
    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
      gap: 0.5rem;
    }
    
    .notification-title {
      margin: 0;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      line-height: 1.25;
    }
    
    .notification-time {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
      white-space: nowrap;
    }
    
    .notification-message {
      margin: 0;
      font-size: 0.775rem;
      color: var(--color-text-secondary);
      line-height: 1.35;
    }
    
    .empty-state {
      padding: var(--spacing-6);
      text-align: center;
      color: var(--color-text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;

      .material-icons-round {
        font-size: 28px;
        color: var(--color-success);
      }

      p {
        margin: 0;
        font-size: 0.8125rem;
      }
    }
  `]
})
export class DashboardNotificationPanelComponent {
  @Input({ required: true }) notifications: Notification[] = [];
  
  getIcon(type: string): string {
    switch(type) {
      case 'info': return 'info';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'alert': return 'error';
      default: return 'notifications';
    }
  }

  formatTime(dateStr: string | undefined | null): string {
    if (!dateStr) return '';
    if (isNaN(Date.parse(dateStr))) {
      return dateStr;
    }
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  }
}
