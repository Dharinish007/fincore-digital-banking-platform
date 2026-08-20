import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-welcome-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-header">
      <div class="header-left">
        <div class="greeting-row">
          <span class="role-badge">{{ role }}</span>
          <span class="date-text">{{ currentDate | date:'EEEE, MMMM d, y' }}</span>
        </div>
        <h1 class="header-title">{{ greeting }}, <span class="user-name">{{ userName }}</span></h1>
        <p class="header-subtitle">Here is what's happening across FinCore banking operations today.</p>
      </div>

      <div class="header-right">
        <div class="meta-card">
          <span class="meta-label">Last Active Session</span>
          <span class="meta-value">{{ lastLogin | date:'MMM d, h:mm a' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--spacing-6);
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    
    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .greeting-row {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      margin-bottom: 0.25rem;
    }
    
    .role-badge {
      background: var(--color-primary-light);
      color: var(--color-primary);
      border: 1px solid var(--color-primary-subtle);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
    }

    .date-text {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    .header-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0;
      letter-spacing: -0.4px;
      line-height: 1.25;

      .user-name {
        color: var(--color-primary);
      }
    }
    
    .header-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.4;
    }
    
    .header-right {
      display: flex;
      align-items: center;
    }

    .meta-card {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      background: var(--color-surface-secondary);
      border: 1px solid var(--color-border);
      padding: 0.5rem 0.875rem;
      border-radius: var(--radius-md);
      
      .meta-label {
        font-size: 0.6875rem;
        text-transform: uppercase;
        color: var(--color-text-muted);
        margin-bottom: 2px;
        letter-spacing: 0.5px;
        font-weight: 600;
      }
      
      .meta-value {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-primary);
        font-variant-numeric: tabular-nums;
      }
    }
    
    @media (max-width: 640px) {
      .dashboard-header {
        padding: 1.25rem;
        flex-direction: column;
        align-items: flex-start;
      }
      
      .header-right {
        width: 100%;
      }

      .meta-card {
        width: 100%;
        align-items: flex-start;
      }

      .header-title {
        font-size: 1.25rem;
      }
    }
  `]
})
export class DashboardWelcomeBannerComponent {
  @Input({ required: true }) userName!: string;
  @Input({ required: true }) role!: string;
  @Input() lastLogin: Date = new Date(Date.now() - 86400000);
  
  currentDate = new Date();
  
  get greeting(): string {
    const hour = this.currentDate.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
