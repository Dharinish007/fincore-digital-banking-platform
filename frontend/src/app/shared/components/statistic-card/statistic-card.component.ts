import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistic-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="stat-card" [ngClass]="'stat-card--' + (cardVariant || 'default')">
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
    .stat-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);

      &:hover {
        border-color: var(--color-border-strong);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
      }

      &--emerald {
        background: var(--color-surface-emerald);
        border-color: var(--color-surface-emerald-border);
      }

      &--blue {
        background: var(--color-surface-blue);
        border-color: var(--color-surface-blue-border);
      }

      &--amber {
        background: var(--color-surface-amber);
        border-color: var(--color-surface-amber-border);
      }

      &--rose {
        background: var(--color-surface-rose);
        border-color: var(--color-surface-rose-border);
      }
    }
    
    .stat-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1px solid var(--color-border);

      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }
    }
    
    .stat-content {
      flex: 1;
      min-width: 0;
      
      .stat-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        margin: 0 0 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 0.4rem;
        line-height: 1.15;
        letter-spacing: -0.4px;
        font-variant-numeric: tabular-nums;
      }
      
      .stat-trend {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 0.75rem;
        font-weight: 600;
        margin: 0;
        padding: 2px 7px;
        border-radius: var(--radius-full);
        background: var(--color-surface-secondary);
        
        .trend-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
        
        &.positive {
          color: var(--color-success);
          background: var(--color-success-bg);
          border: 1px solid var(--color-success-border);
        }

        &.negative {
          color: var(--color-danger);
          background: var(--color-danger-bg);
          border: 1px solid var(--color-danger-border);
        }
        
        .trend-text {
          color: var(--color-text-muted);
          font-weight: 400;
          margin-left: 2px;
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
  @Input() cardVariant?: 'default' | 'emerald' | 'blue' | 'amber' | 'rose' = 'default';
  @Input() iconBgColor = 'var(--color-primary-light)';
  @Input() iconColor = 'var(--color-primary)';
}
