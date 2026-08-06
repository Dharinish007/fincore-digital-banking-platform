import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { DatePreset, TransactionType } from '../../models/banking.models';

@Component({
  selector: 'app-filter-panel',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-card">
      <div class="filter-header">
        <div class="filter-title-group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <h3>STATEMENT DATA FETCHER & FILTERING ENGINE</h3>
        </div>
        <button type="button" class="reset-btn" (click)="txService.resetFilters()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6"/>
            <path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Reset Filters
        </button>
      </div>

      <!-- Date Range Selector Row -->
      <div class="filter-section">
        <label class="section-label">1. DATE RANGE SELECTOR</label>
        <div class="preset-pills">
          <button 
            type="button" 
            class="preset-pill" 
            [class.active]="txService.filter().datePreset === '30_DAYS'"
            (click)="selectPreset('30_DAYS')"
          >
            Last 30 Days
          </button>
          <button 
            type="button" 
            class="preset-pill" 
            [class.active]="txService.filter().datePreset === 'CURRENT_MONTH'"
            (click)="selectPreset('CURRENT_MONTH')"
          >
            Current Month (Jul 2026)
          </button>
          <button 
            type="button" 
            class="preset-pill" 
            [class.active]="txService.filter().datePreset === 'YEAR_TO_DATE'"
            (click)="selectPreset('YEAR_TO_DATE')"
          >
            Year To Date (2026)
          </button>
          <button 
            type="button" 
            class="preset-pill" 
            [class.active]="txService.filter().datePreset === 'LAST_FINANCIAL_YEAR'"
            (click)="selectPreset('LAST_FINANCIAL_YEAR')"
          >
            Last Financial Year (FY25-26)
          </button>
          <button 
            type="button" 
            class="preset-pill" 
            [class.active]="txService.filter().datePreset === 'CUSTOM'"
            (click)="selectPreset('CUSTOM')"
          >
            Custom Range
          </button>
        </div>

        <!-- Custom Date Inputs -->
        <div class="custom-date-row" *ngIf="txService.filter().datePreset === 'CUSTOM'">
          <div class="date-input-group">
            <label>Start Date</label>
            <input 
              type="date" 
              [ngModel]="txService.filter().startDate"
              (ngModelChange)="onStartDateChange($event)"
              class="date-picker"
            />
          </div>
          <div class="date-sep">to</div>
          <div class="date-input-group">
            <label>End Date</label>
            <input 
              type="date" 
              [ngModel]="txService.filter().endDate"
              (ngModelChange)="onEndDateChange($event)"
              class="date-picker"
            />
          </div>
        </div>
      </div>

      <!-- Transaction Type & Category Filter Rules -->
      <div class="filter-grid">
        <!-- Types Multiselect -->
        <div class="filter-section">
          <label class="section-label">2. TRANSACTION TYPE FILTERS</label>
          <div class="type-pills">
            <button 
              *ngFor="let t of availableTypes"
              type="button"
              class="type-pill"
              [class.selected]="txService.filter().selectedTypes.includes(t.type)"
              (click)="txService.toggleType(t.type)"
            >
              <span class="type-dot" [style.background]="t.color"></span>
              {{ t.label }}
            </button>
          </div>
        </div>

        <!-- Category & Search & Amount Filters -->
        <div class="filter-section">
          <label class="section-label">3. CATEGORY & KEYWORD FILTER</label>
          <div class="inputs-row">
            <div class="select-box">
              <label>Category</label>
              <select 
                [ngModel]="txService.filter().category"
                (ngModelChange)="txService.setCategory($event)"
                class="form-select"
              >
                <option value="ALL">All Categories</option>
                <option *ngFor="let cat of txService.categories()" [value]="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="search-box">
              <label>Search Keyword / Ref ID</label>
              <div class="search-input-wrapper">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  type="text" 
                  [ngModel]="txService.filter().searchQuery"
                  (ngModelChange)="txService.setSearchQuery($event)"
                  placeholder="e.g. Salary, Whole Foods, TXN-984..."
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .filter-title-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #60a5fa;
    }
    .filter-title-group h3 {
      font-size: 0.88rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #f8fafc;
      margin: 0;
    }
    .reset-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: transparent;
      border: 1px solid #475569;
      color: #94a3b8;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .reset-btn:hover {
      background: #334155;
      color: #ffffff;
    }
    .filter-section {
      margin-bottom: 1rem;
    }
    .section-label {
      display: block;
      font-size: 0.68rem;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.8px;
      margin-bottom: 0.5rem;
    }
    .preset-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .preset-pill {
      background: #0f172a;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .preset-pill:hover {
      border-color: #3b82f6;
      color: #ffffff;
    }
    .preset-pill.active {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-color: #60a5fa;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    }
    .custom-date-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 0.85rem;
      background: #0f172a;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    .date-input-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .date-input-group label {
      font-size: 0.65rem;
      color: #94a3b8;
      font-weight: 700;
    }
    .date-picker {
      background: #1e293b;
      border: 1px solid #475569;
      color: #ffffff;
      padding: 0.35rem 0.6rem;
      border-radius: 6px;
      font-size: 0.8rem;
    }
    .date-sep {
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 700;
      align-self: flex-end;
      padding-bottom: 0.4rem;
    }
    .filter-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .type-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .type-pill {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #0f172a;
      border: 1px solid #334155;
      color: #64748b;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .type-pill.selected {
      background: #1e293b;
      border-color: #3b82f6;
      color: #f8fafc;
    }
    .type-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .inputs-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .select-box label, .search-box label {
      display: block;
      font-size: 0.65rem;
      color: #94a3b8;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .form-select, .form-input {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 0.45rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
    }
    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-input-wrapper svg {
      position: absolute;
      left: 0.75rem;
      color: #64748b;
    }
    .search-input-wrapper input {
      padding-left: 2.2rem;
    }
    @media (max-width: 900px) {
      .filter-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FilterPanelComponent {
  txService = inject(TransactionService);

  readonly availableTypes: { type: TransactionType; label: string; color: string }[] = [
    { type: 'CREDIT', label: 'Credits (+)', color: '#10b981' },
    { type: 'DEBIT', label: 'Debits (-)', color: '#ef4444' },
    { type: 'WIRE_TRANSFER', label: 'Wire Transfers', color: '#3b82f6' },
    { type: 'ATM_WITHDRAWAL', label: 'ATM Cash', color: '#f59e0b' },
    { type: 'FEE', label: 'Bank Fees', color: '#ec4899' },
    { type: 'INTEREST', label: 'Interest Earned', color: '#8b5cf6' }
  ];

  selectPreset(preset: DatePreset) {
    this.txService.setPreset(preset);
  }

  onStartDateChange(dateStr: string) {
    const end = this.txService.filter().endDate;
    this.txService.setCustomDates(dateStr, end);
  }

  onEndDateChange(dateStr: string) {
    const start = this.txService.filter().startDate;
    this.txService.setCustomDates(start, dateStr);
  }
}
