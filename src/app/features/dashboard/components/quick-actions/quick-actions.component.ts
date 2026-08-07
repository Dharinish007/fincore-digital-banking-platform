import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { QuickAction } from '../../models/dashboard.model';
@Component({
  selector: 'app-dashboard-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatRippleModule],
  template: `
    <div class="quick-actions-grid">
      @for (action of actions; track action.label) {
        <a [routerLink]="action.route" class="action-card" matRipple>
          <div class="action-icon">
            <mat-icon>{{ action.icon }}</mat-icon>
          </div>
          <span class="action-label">{{ action.label }}</span>
        </a>
      }
    </div>
  `,
  styles: [`
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: var(--spacing-4);
    }
    
    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-4);
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      text-decoration: none;
      transition: all var(--transition-fast);
      gap: var(--spacing-3);
      cursor: pointer;
      
      &:hover {
        border-color: var(--accent);
        background: var(--bg-surface-2);
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
        
        .action-icon {
          background: var(--accent);
          color: white;
        }
      }
    }
    
    .action-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--bg-surface-2);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      
      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
    
    .action-label {
      font-size: 0.85rem;
      font-weight: 500;
      text-align: center;
    }
  `]
})
export class DashboardQuickActionsComponent {
  @Input({ required: true }) actions: QuickAction[] = [];
}
