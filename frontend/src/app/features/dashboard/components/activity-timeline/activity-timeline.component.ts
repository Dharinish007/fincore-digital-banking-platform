import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Activity } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-activity-timeline',
  standalone: true,
  imports: [CommonModule, MatIconModule],
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
              <span class="timeline-time">{{ formatTime(item.timestamp) }}</span>
            </div>
            <p class="timeline-description">{{ item.description }}</p>
            @if (item.actor) {
              <span class="timeline-actor">Initiated by {{ item.actor }}</span>
            }
          </div>
        </div>
      }
      @if (activities.length === 0) {
        <div class="empty-state">
          <span class="material-icons-round">history</span>
          <p>No recent operational activity recorded.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .timeline {
      display: flex;
      flex-direction: column;
    }
    
    .timeline-item {
      display: flex;
      gap: 0.875rem;
      min-height: 64px;

      &:last-child .timeline-content {
        padding-bottom: 0;
      }
    }
    
    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 28px;
    }
    
    .marker-icon {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      background: var(--color-background-subtle);
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
      z-index: 2;
      flex-shrink: 0;
      
      mat-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
      }
    }
    
    .marker-line {
      flex: 1;
      width: 1.5px;
      background: var(--color-border);
      margin: 4px 0;
    }
    
    .timeline-content {
      flex: 1;
      min-width: 0;
      padding-bottom: 1rem;
    }
    
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
      gap: 0.5rem;
    }
    
    .timeline-title {
      margin: 0;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-text-primary);
      line-height: 1.25;
    }
    
    .timeline-time {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
      white-space: nowrap;
    }
    
    .timeline-description {
      margin: 0 0 2px;
      font-size: 0.775rem;
      color: var(--color-text-secondary);
      line-height: 1.35;
    }
    
    .timeline-actor {
      font-size: 0.6875rem;
      color: var(--color-text-muted);
      font-weight: 500;
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
      }

      p {
        margin: 0;
        font-size: 0.8125rem;
      }
    }
  `]
})
export class DashboardActivityTimelineComponent {
  @Input({ required: true }) activities: Activity[] = [];

  formatTime(timeStr: string | undefined | null): string {
    if (!timeStr) return '';
    if (isNaN(Date.parse(timeStr))) {
      return timeStr;
    }
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  }
}
