import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialCalculationService } from '../../services/financial-calculation.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-financial-summary',
  imports: [CommonModule],
  template: `
    <div class="summary-wrapper">
      <div class="summary-section-header">
        <div class="section-title-group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <h3>FINANCIAL CALCULATION ENGINE & STATISTICAL METRICS</h3>
        </div>
        <div class="calculation-formula">
          <span class="formula-label">FORMULA:</span> 
          <span class="formula-code">Closing Balance = Opening Balance + Total Credits - Total Debits</span>
        </div>
      </div>

      <!-- Main 5 Summary Metric Cards -->
      <div class="cards-grid">
        <!-- 1. Opening Balance -->
        <div class="stat-card">
          <div class="card-icon opening">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="card-meta">
            <span class="card-label">OPENING BALANCE</span>
            <div class="card-value">
              {{ accountService.formatCurrency(calcService.summary().openingBalance) }}
            </div>
            <span class="card-hint">Balance right before start date</span>
          </div>
        </div>

        <!-- 2. Total Credits -->
        <div class="stat-card">
          <div class="card-icon credit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="19" x2="12" y2="5"/>
              <polyline points="5 12 12 5 19 12"/>
            </svg>
          </div>
          <div class="card-meta">
            <span class="card-label">TOTAL CREDITS (+)</span>
            <div class="card-value text-credit">
              +{{ accountService.formatCurrency(calcService.summary().totalCredits) }}
            </div>
            <span class="card-hint">{{ calcService.summary().creditCount }} incoming transactions</span>
          </div>
        </div>

        <!-- 3. Total Debits -->
        <div class="stat-card">
          <div class="card-icon debit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="19 12 12 19 5 12"/>
            </svg>
          </div>
          <div class="card-meta">
            <span class="card-label">TOTAL DEBITS (-)</span>
            <div class="card-value text-debit">
              -{{ accountService.formatCurrency(calcService.summary().totalDebits) }}
            </div>
            <span class="card-hint">{{ calcService.summary().debitCount }} outgoing transactions</span>
          </div>
        </div>

        <!-- 4. Fee & Interest Summary -->
        <div class="stat-card">
          <div class="card-icon fee">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="card-meta">
            <span class="card-label">FEE & INTEREST SUMMARY</span>
            <div class="card-value text-amber">
              {{ accountService.formatCurrency(calcService.summary().totalInterest - calcService.summary().totalFees) }}
            </div>
            <span class="card-hint">
              Fees: {{ accountService.formatCurrency(calcService.summary().totalFees) }} | Interest: {{ accountService.formatCurrency(calcService.summary().totalInterest) }}
            </span>
          </div>
        </div>

        <!-- 5. Closing Balance -->
        <div class="stat-card closing-highlight">
          <div class="card-icon closing">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="card-meta">
            <span class="card-label">CLOSING BALANCE</span>
            <div class="card-value text-emerald">
              {{ accountService.formatCurrency(calcService.summary().closingBalance) }}
            </div>
            <span class="card-hint text-blue">Verified Net Account Position</span>
          </div>
        </div>
      </div>

      <!-- Category Distribution Bar -->
      <div class="category-distribution" *ngIf="calcService.summary().categoryBreakdown.length > 0">
        <div class="distribution-header">
          <span class="dist-title">CATEGORY SPEND & INFLOW BREAKDOWN</span>
          <span class="dist-subtitle">Aggregated volume distribution for period</span>
        </div>
        <div class="multi-progress-bar">
          <div 
            *ngFor="let item of calcService.summary().categoryBreakdown"
            class="progress-segment"
            [style.width.%]="item.percentage"
            [style.background-color]="item.color"
            [title]="item.category + ': ' + item.percentage + '% (' + accountService.formatCurrency(item.amount) + ')'"
          ></div>
        </div>
        <div class="category-legend">
          <div *ngFor="let item of calcService.summary().categoryBreakdown" class="legend-item">
            <span class="legend-dot" [style.background-color]="item.color"></span>
            <span class="legend-cat">{{ item.category }}</span>
            <span class="legend-amt">{{ accountService.formatCurrency(item.amount) }} ({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .summary-wrapper {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .summary-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .section-title-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #3b82f6;
    }
    .section-title-group h3 {
      font-size: 0.88rem;
      font-weight: 800;
      color: #f8fafc;
      margin: 0;
    }
    .calculation-formula {
      font-size: 0.72rem;
      background: rgba(15, 23, 42, 0.6);
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .formula-label {
      font-weight: 800;
      color: #94a3b8;
    }
    .formula-code {
      font-weight: 700;
      color: #60a5fa;
      font-family: monospace;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .stat-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      position: relative;
      overflow: hidden;
    }
    .stat-card.closing-highlight {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.9));
      border-color: rgba(16, 185, 129, 0.4);
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
    }
    .card-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-icon.opening { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; }
    .card-icon.credit { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .card-icon.debit { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
    .card-icon.fee { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .card-icon.closing { background: rgba(16, 185, 129, 0.25); color: #10b981; }

    .card-meta {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .card-label {
      font-size: 0.65rem;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.5px;
    }
    .card-value {
      font-size: 1.15rem;
      font-weight: 800;
      color: #ffffff;
    }
    .text-credit { color: #34d399; }
    .text-debit { color: #f87171; }
    .text-amber { color: #fbbf24; }
    .text-emerald { color: #10b981; }
    .text-blue { color: #60a5fa; }

    .card-hint {
      font-size: 0.65rem;
      color: #64748b;
      font-weight: 600;
    }

    .category-distribution {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1rem;
    }
    .distribution-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.6rem;
    }
    .dist-title {
      font-size: 0.72rem;
      font-weight: 800;
      color: #cbd5e1;
      letter-spacing: 0.5px;
    }
    .dist-subtitle {
      font-size: 0.65rem;
      color: #64748b;
    }
    .multi-progress-bar {
      height: 10px;
      background: #1e293b;
      border-radius: 6px;
      display: flex;
      overflow: hidden;
      margin-bottom: 0.75rem;
    }
    .progress-segment {
      height: 100%;
      transition: width 0.3s ease;
    }
    .category-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.72rem;
    }
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .legend-cat {
      color: #cbd5e1;
      font-weight: 600;
    }
    .legend-amt {
      color: #94a3b8;
      font-weight: 700;
    }

    @media (max-width: 1200px) {
      .cards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class FinancialSummaryComponent {
  calcService = inject(FinancialCalculationService);
  accountService = inject(AccountService);
}
