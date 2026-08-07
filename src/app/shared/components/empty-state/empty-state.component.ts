import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state-container">
      <div class="icon-wrapper">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
      
      @if (actionLabel) {
        <button mat-flat-button color="primary" class="action-btn" (click)="actionClicked.emit()">
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-10) var(--spacing-6);
      text-align: center;
      background: var(--bg-surface-2);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-color);
    }
    
    .icon-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--bg-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-4);
      box-shadow: var(--shadow-sm);
      
      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: var(--text-muted);
      }
    }
    
    .empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-2);
    }
    
    .empty-description {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-6);
      max-width: 400px;
    }
    
    .action-btn {
      padding: 0 var(--spacing-6);
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() actionLabel?: string;
  
  @Output() actionClicked = new EventEmitter<void>();
}
