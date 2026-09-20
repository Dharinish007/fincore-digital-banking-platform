import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="corporate-card" [class.no-padding]="noPadding">
      @if (title) {
        <div class="card-header">
          <div class="card-header-left">
            <h3 class="card-title">{{ title }}</h3>
            @if (subtitle) {
              <p class="card-subtitle">{{ subtitle }}</p>
            }
          </div>
          <div class="card-header-actions">
            <ng-content select="[card-actions]"></ng-content>
          </div>
        </div>
      }
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .corporate-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

      &:hover {
        border-color: var(--color-border-strong);
      }

      &.no-padding .card-body {
        padding: 0;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
      gap: 1rem;

      .card-header-left {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .card-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-text-primary);
        letter-spacing: -0.2px;
        line-height: 1.3;
      }

      .card-subtitle {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--color-text-muted);
        line-height: 1.3;
      }

      .card-header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    .card-body {
      padding: 1.25rem;
    }
  `]
})
export class CardContainerComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() noPadding = false;
}
