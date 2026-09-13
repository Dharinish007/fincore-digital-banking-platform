import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent } from '../../components/filter-panel/filter-panel';
import { FinancialSummaryComponent } from '../../components/financial-summary/financial-summary';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table';
import { ModalService } from '../../services/modal.service';
import { AccountService } from '../../services/account.service';
import { ExportPdfService } from '../../services/export-pdf.service';
import { ExportDataService } from '../../services/export-data.service';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [
    CommonModule,
    FilterPanelComponent,
    FinancialSummaryComponent,
    TransactionTableComponent
  ],
  template: `
    <div class="statement-tab-wrapper">
      <!-- Dedicated Statement Generation Control Bar -->
      <div class="statement-top-bar">
        <div class="header-info">
          <div class="title-with-badge">
            <h2>STATEMENT GENERATION & EXPORT ENGINE</h2>
            <span class="official-badge">OFFICIAL BANKING</span>
          </div>
          <p class="subtitle">Generate, reconcile, preview and export official certified account statements</p>
        </div>

        <!-- Direct Statement Generation Actions -->
        <div class="generation-actions">
          <button type="button" class="btn-action btn-preview" (click)="modalService.openPreviewModal()" title="Open formal PDF preview modal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Preview Statement</span>
          </button>

          <button type="button" class="btn-action btn-pdf" (click)="exportPdfService.downloadPdf('CLASSIC')" title="Direct download PDF statement">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>Download PDF</span>
          </button>

          <button type="button" class="btn-action btn-excel" (click)="exportDataService.exportToExcel()" title="Export transactions as Excel spreadsheet">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
              <line x1="15" y1="3" x2="15" y2="21"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="3" y1="15" x2="21" y2="15"/>
            </svg>
            <span>Excel</span>
          </button>

          <button type="button" class="btn-action btn-csv" (click)="exportDataService.exportToCsv()" title="Export CSV data">
            <span>CSV</span>
          </button>

          <button type="button" class="btn-action btn-email" (click)="modalService.openEmailModal()" title="Email formal statement to customer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>Email</span>
          </button>
        </div>
      </div>

      <!-- Active Statement Account Overview Card -->
      <div class="account-statement-card">
        <div class="acc-col">
          <span class="col-label">ACCOUNT HOLDER</span>
          <span class="col-val">{{ accountService.activeAccount().holderName }}</span>
        </div>
        <div class="acc-col">
          <span class="col-label">ACCOUNT NUMBER</span>
          <span class="col-val font-mono">{{ accountService.maskAccountNumber(accountService.activeAccount().accountNumber) }}</span>
        </div>
        <div class="acc-col">
          <span class="col-label">ACCOUNT TYPE</span>
          <span class="col-val">{{ accountService.activeAccount().name }}</span>
        </div>
        <div class="acc-col">
          <span class="col-label">BRANCH / ROUTING</span>
          <span class="col-val font-mono">{{ accountService.activeAccount().routingNumber }} • {{ accountService.activeAccount().bankBranch }}</span>
        </div>
        <div class="acc-col acc-balance">
          <span class="col-label">CURRENT LEDGER BALANCE</span>
          <span class="col-val balance-text">{{ accountService.formatCurrency(accountService.activeAccount().balance) }}</span>
        </div>
      </div>

      <!-- 1. Statement Filter & Period Selection Engine -->
      <app-filter-panel></app-filter-panel>

      <!-- 2. Financial Metrics & Balancing Engine (Opening, Credits, Debits, Closing) -->
      <app-financial-summary></app-financial-summary>

      <!-- 3. Certified Statement Transactions Ledger -->
      <app-transaction-table></app-transaction-table>
    </div>
  `,
  styles: [`
    .statement-tab-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .statement-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-color, #292d3e);
    }
    .title-with-badge {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .title-with-badge h2 {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text-main, #f1f5f9);
      margin: 0;
      letter-spacing: 0.02em;
    }
    .official-badge {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid #0284c7;
      color: #38bdf8;
      font-size: 0.68rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 0.08em;
    }
    .subtitle {
      font-size: 0.85rem;
      color: var(--text-muted, #94a3b8);
      margin-top: 0.25rem;
    }
    .generation-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 0.9rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .btn-preview {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .btn-preview:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }
    .btn-pdf {
      background: linear-gradient(135deg, #059669, #047857);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    }
    .btn-pdf:hover {
      background: #047857;
      transform: translateY(-1px);
    }
    .btn-excel {
      background: #1e293b;
      border-color: #334155;
      color: #34d399;
    }
    .btn-excel:hover {
      background: #334155;
      border-color: #34d399;
    }
    .btn-csv {
      background: #1e293b;
      border-color: #334155;
      color: #94a3b8;
    }
    .btn-csv:hover {
      background: #334155;
      color: #ffffff;
    }
    .btn-email {
      background: #1e293b;
      border-color: #334155;
      color: #38bdf8;
    }
    .btn-email:hover {
      background: #334155;
      border-color: #38bdf8;
    }

    /* Account Statement Overview Card */
    .account-statement-card {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    .acc-col {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .col-label {
      font-size: 0.68rem;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.05em;
    }
    .col-val {
      font-size: 0.88rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .font-mono {
      font-family: monospace;
    }
    .acc-balance .balance-text {
      color: #34d399;
      font-size: 1.05rem;
    }
  `]
})
export class StatementsComponent {
  readonly modalService = inject(ModalService);
  readonly accountService = inject(AccountService);
  readonly exportPdfService = inject(ExportPdfService);
  readonly exportDataService = inject(ExportDataService);
}
