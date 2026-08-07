import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Notification } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-notification-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, DatePipe],
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
              <span class="notification-time">{{ notification.date | date:'shortTime' }}</span>
            </div>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
        </div>
      }
      @if (notifications.length === 0) {
        <div class="empty-state">
          <p>No new notifications</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-list {
      display: flex;
      flex-direction: column;
    }
    
    .notification-item {
      display: flex;
      gap: var(--spacing-3);
      padding: var(--spacing-4) 0;
      border-bottom: 1px solid var(--border-color);
      
      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      
      &:first-child {
        padding-top: 0;
      }
      
      &.unread {
        .notification-title {
          font-weight: 600;
          color: var(--text-primary);
        }
      }
    }
    
    .notification-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      
      &.icon-info {
        background: var(--info-light);
        color: var(--info-dark);
      }
      
      &.icon-success {
        background: var(--success-light);
        color: var(--success-dark);
      }
      
      &.icon-warning {
        background: var(--warning-light);
        color: var(--warning-dark);
      }
      
      &.icon-alert {
        background: var(--danger-light);
        color: var(--danger-dark);
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
      margin-bottom: var(--spacing-1);
    }
    
    .notification-title {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    
    .notification-time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    
    .notification-message {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    
    .empty-state {
      padding: var(--spacing-4);
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
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
}
