import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-welcome-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-banner">
      <div class="welcome-content">
        <h2 class="welcome-title">{{ greeting }}, <span class="highlight">{{ userName }}</span></h2>
        <p class="welcome-subtitle">
          <span class="role-badge">{{ role }}</span>
          <span class="date-text">{{ currentDate | date:'EEEE, MMMM d, y' }}</span>
        </p>
      </div>
      <div class="welcome-meta">
        <p class="meta-label">Last Login</p>
        <p class="meta-value">{{ lastLogin | date:'MMM d, h:mm a' }}</p>
      </div>
      <div class="decoration" aria-hidden="true"></div>
    </div>
  `,
  styles: [`
    .welcome-banner {
      position: relative;
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
      border-radius: var(--radius-lg);
      padding: var(--spacing-6) var(--spacing-8);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      margin-bottom: var(--spacing-6);
    }
    
    .welcome-content {
      position: relative;
      z-index: 2;
    }
    
    .welcome-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 var(--spacing-2);
      
      .highlight {
        font-weight: 700;
      }
    }
    
    .welcome-subtitle {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin: 0;
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .role-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    
    .welcome-meta {
      position: relative;
      z-index: 2;
      text-align: right;
      background: rgba(0, 0, 0, 0.2);
      padding: var(--spacing-3) var(--spacing-5);
      border-radius: var(--radius-md);
      backdrop-filter: blur(4px);
      
      .meta-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 var(--spacing-1);
        letter-spacing: 0.5px;
      }
      
      .meta-value {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
      }
    }
    
    .decoration {
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
      border-radius: 50%;
      z-index: 1;
    }
    
    @media (max-width: 768px) {
      .welcome-banner {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-4);
        padding: var(--spacing-5);
      }
      
      .welcome-meta {
        text-align: left;
        width: 100%;
      }
    }
  `]
})
export class DashboardWelcomeBannerComponent {
  @Input({ required: true }) userName!: string;
  @Input({ required: true }) role!: string;
  @Input() lastLogin: Date = new Date(Date.now() - 86400000); // Default to yesterday
  
  currentDate = new Date();
  
  get greeting(): string {
    const hour = this.currentDate.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
