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
      padding: 3rem 1.5rem;
      text-align: center;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--color-border);
    }
    
    .icon-wrapper {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: var(--color-background-subtle);
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      
      mat-icon {
        font-size: 26px;
        width: 26px;
        height: 26px;
        color: var(--color-text-muted);
      }
    }
    
    .empty-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.4rem;
      letter-spacing: -0.2px;
    }
    
    .empty-description {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin: 0 0 1.25rem;
      max-width: 380px;
      line-height: 1.45;
    }
    
    .action-btn {
      padding: 0 1.25rem;
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
