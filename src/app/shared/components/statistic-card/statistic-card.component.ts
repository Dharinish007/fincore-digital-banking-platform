import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistic-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="stat-card">
      <div class="stat-icon-wrapper" [style.background-color]="iconBgColor">
        <mat-icon [style.color]="iconColor">{{ icon }}</mat-icon>
      </div>
      <div class="stat-content">
        <p class="stat-label">{{ label }}</p>
        <h2 class="stat-value">{{ value }}</h2>
        @if (trend !== undefined) {
          <p class="stat-trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
            <mat-icon class="trend-icon">
              {{ trend > 0 ? 'trending_up' : trend < 0 ? 'trending_down' : 'trending_flat' }}
            </mat-icon>
            {{ trend > 0 ? '+' : '' }}{{ trend }}% 
            <span class="trend-text">vs last month</span>
          </p>
        }
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/themes/mixins' as mixins;
    
    .stat-card {
      @include mixins.corporate-card;
      padding: var(--spacing-5);
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-4);
    }
    
    .stat-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .stat-content {
      flex: 1;
      
      .stat-label {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-secondary);
        margin: 0 0 var(--spacing-1);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 var(--spacing-2);
        line-height: 1.2;
      }
      
      .stat-trend {
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
        font-size: 0.85rem;
        font-weight: 600;
        margin: 0;
        
        .trend-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
        
        &.positive { color: var(--success); }
        &.negative { color: var(--danger); }
        
        .trend-text {
          color: var(--text-muted);
          font-weight: 400;
        }
      }
    }
  `]
})
export class StatisticCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) icon!: string;
  @Input() trend?: number;
  @Input() iconBgColor = 'var(--accent-light)';
  @Input() iconColor = 'var(--accent)';
}
