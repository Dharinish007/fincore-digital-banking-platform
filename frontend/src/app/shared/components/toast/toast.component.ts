import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  type: ToastType;
  title: string;
  message: string;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="toast-card" [ngClass]="'toast-' + data.type" role="alert" aria-live="assertive">
      <div class="toast-icon-wrapper" aria-hidden="true">
        <mat-icon class="toast-icon">{{ getIcon() }}</mat-icon>
      </div>
      <div class="toast-body">
        <h4 class="toast-title">{{ data.title }}</h4>
        <p class="toast-message">{{ data.message }}</p>
      </div>
      <button
        type="button"
        class="toast-close-btn"
        (click)="dismiss()"
        aria-label="Dismiss notification"
      >
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .toast-card {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: var(--color-surface-elevated);
      border: 1px solid var(--color-border-strong);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      color: var(--color-text-primary);
      position: relative;
      overflow: hidden;
      min-width: 300px;
      max-width: 440px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
      }

      &.toast-success {
        &::before { background-color: var(--color-success); }
        .toast-icon { color: var(--color-success); }
        .toast-icon-wrapper { background: var(--color-success-bg); }
      }

      &.toast-error {
        &::before { background-color: var(--color-danger); }
        .toast-icon { color: var(--color-danger); }
        .toast-icon-wrapper { background: var(--color-danger-bg); }
      }

      &.toast-warning {
        &::before { background-color: var(--color-warning); }
        .toast-icon { color: var(--color-warning); }
        .toast-icon-wrapper { background: var(--color-warning-bg); }
      }

      &.toast-info {
        &::before { background-color: var(--color-info); }
        .toast-icon { color: var(--color-info); }
        .toast-icon-wrapper { background: var(--color-info-bg); }
      }
    }

    .toast-icon-wrapper {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .toast-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .toast-body {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .toast-title {
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0;
      line-height: 1.3;
      letter-spacing: -0.2px;
    }

    .toast-message {
      font-size: 0.775rem;
      color: var(--color-text-secondary);
      margin: 0;
      line-height: 1.4;
    }

    .toast-close-btn {
      color: var(--color-text-muted);
      border: none;
      background: transparent;
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-xs);
      cursor: pointer;
      transition: color var(--transition-fast), background-color var(--transition-fast);
      flex-shrink: 0;
      margin-left: 0.25rem;
      margin-top: -2px;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &:hover {
        color: var(--color-text-primary);
        background: var(--color-surface-hover);
      }
    }
  `]
})
export class ToastComponent {
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ToastData) {}

  getIcon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
