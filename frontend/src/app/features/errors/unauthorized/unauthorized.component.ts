import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="error-page">
      <div class="error-container">
        <span class="material-icons-round error-icon">lock_person</span>
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have sufficient permissions to access this financial resource. Please contact your system administrator.</p>
        <a routerLink="/dashboard" class="btn btn--primary">Return to Home</a>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 75vh;
    }
    .error-container {
      text-align: center;
      max-width: 440px;
      padding: 2.5rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
    }
    .error-icon {
      font-size: 56px;
      color: var(--color-danger);
      margin-bottom: 0.75rem;
    }
    h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0;
      color: var(--color-text-primary);
      letter-spacing: -1px;
    }
    h2 {
      margin: 0 0 0.75rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-secondary);
    }
    p {
      color: var(--color-text-muted);
      margin-bottom: 1.75rem;
      font-size: 0.875rem;
      line-height: 1.5;
    }
  `]
})
export class UnauthorizedComponent {}
