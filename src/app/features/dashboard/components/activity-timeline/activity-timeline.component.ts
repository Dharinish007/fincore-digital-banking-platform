import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Activity } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-activity-timeline',
  standalone: true,
  imports: [CommonModule, MatIconModule, DatePipe],
  template: `
    <div class="timeline">
      @for (item of activities; track item.id; let last = $last) {
        <div class="timeline-item">
          <div class="timeline-marker">
            <div class="marker-icon">
              <mat-icon>{{ item.icon }}</mat-icon>
            </div>
            @if (!last) {
              <div class="marker-line"></div>
            }
          </div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h4 class="timeline-title">{{ item.action }}</h4>
              <span class="timeline-time">{{ item.timestamp | date:'shortTime' }}</span>
            </div>
            <p class="timeline-description">{{ item.description }}</p>
            <p class="timeline-actor">by {{ item.actor }}</p>
          </div>
        </div>
      }
      @if (activities.length === 0) {
        <div class="empty-state">
          <p>No recent activity</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .timeline {
      padding-top: var(--spacing-2);
    }
    
    .timeline-item {
      display: flex;
      gap: var(--spacing-4);
      min-height: 80px;
    }
    
    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 32px;
    }
    
    .marker-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-surface-2);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      z-index: 2;
      
      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }
    
    .marker-line {
      flex: 1;
      width: 2px;
      background: var(--border-color);
      margin-top: 4px;
      margin-bottom: 4px;
    }
    
    .timeline-content {
      flex: 1;
      padding-bottom: var(--spacing-5);
    }
    
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-1);
    }
    
    .timeline-title {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .timeline-time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    
    .timeline-description {
      margin: 0 0 var(--spacing-1);
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    
    .timeline-actor {
      margin: 0;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-style: italic;
    }
    
    .empty-state {
      padding: var(--spacing-4);
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
  `]
})
export class DashboardActivityTimelineComponent {
  @Input({ required: true }) activities: Activity[] = [];
}
