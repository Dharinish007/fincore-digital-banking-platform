import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="error-page">
      <div class="error-container">
        <span class="material-icons-round error-icon">lock</span>
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page. Please contact your system administrator if you believe this is a mistake.</p>
        <a routerLink="/dashboard" class="btn-primary">Return to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 80vh;
    }
    .error-container {
      text-align: center;
      max-width: 400px;
      padding: 2rem;
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }
    .error-icon {
      font-size: 64px;
      color: var(--danger);
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 4rem;
      margin: 0;
      color: var(--text-primary);
    }
    h2 {
      margin: 0 0 1rem;
      color: var(--text-secondary);
    }
    p {
      color: var(--text-muted);
      margin-bottom: 2rem;
      line-height: 1.5;
    }
    .btn-primary {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: var(--accent);
      color: #fff;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: background-color var(--transition-base);
    }
    .btn-primary:hover {
      background-color: var(--accent-hover);
    }
  `]
})
export class UnauthorizedComponent {}
