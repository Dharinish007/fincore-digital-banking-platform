import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="spinner-container" [class.overlay]="overlay" [class.fullscreen]="fullscreen">
      <mat-spinner [diameter]="diameter" [color]="color"></mat-spinner>
      @if (message) {
        <p class="spinner-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-6);
      gap: var(--spacing-4);
      
      &.overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.7);
        z-index: 10;
        backdrop-filter: blur(2px);
      }
      
      &.fullscreen {
        position: fixed;
        background: var(--bg-surface);
        z-index: var(--z-modal);
      }
    }
    
    .spinner-message {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin: 0;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() message?: string;
  @Input() overlay = false;
  @Input() fullscreen = false;
}
