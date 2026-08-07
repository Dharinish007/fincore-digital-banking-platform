import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="error-page">
      <div class="error-container">
        <span class="material-icons-round error-icon">explore_off</span>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
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
      color: var(--warning);
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
export class NotFoundComponent {}
