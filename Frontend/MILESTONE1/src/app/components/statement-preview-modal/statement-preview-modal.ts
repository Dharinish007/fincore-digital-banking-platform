import { Component, inject, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportPdfService } from '../../services/export-pdf.service';
import { ExportDataService } from '../../services/export-data.service';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { FinancialCalculationService } from '../../services/financial-calculation.service';
import { DeliveryStorageService } from '../../services/delivery-storage.service';
import { StatementTemplate } from '../../models/banking.models';

@Component({
  selector: 'app-statement-preview-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <!-- Modal Top Bar -->
        <div class="modal-header">
          <div class="modal-title-group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <div>
              <h3>FORMAL BANK STATEMENT GENERATOR & PREVIEW</h3>
              <div class="modal-subtitle">Generate client-ready PDF & Excel documents</div>
            </div>
          </div>

          <div class="header-actions">
            <!-- Template Selector -->
            <div class="template-switcher">
              <label>Template Preset:</label>
              <select [value]="selectedTemplate()" (change)="onTemplateChange($event)">
                <option value="CLASSIC">Classic Official Banking</option>
                <option value="EXECUTIVE">Executive Minimalist</option>
                <option value="TAX">Tax & Fee Detailed Breakdown</option>
              </select>
            </div>

            <button type="button" class="close-btn" (click)="closeModal()">✕</button>
          </div>
        </div>

        <!-- Statement Document Live Preview Frame -->
        <div class="document-preview-scroll">
          <div class="bank-document-sheet" [class.template-executive]="selectedTemplate() === 'EXECUTIVE'" [class.template-tax]="selectedTemplate() === 'TAX'">
            
            <!-- Document Header -->
            <div class="doc-header">
              <div class="bank-identity">
                <div class="bank-symbol">FC</div>
                <div>
                  <div class="doc-bank-name">FINCORE BANKING</div>
                  <div class="doc-bank-sub">MEMBER FDIC | EQUAL HOUSING LENDER</div>
                  <div class="doc-branch">Routing #: {{ accountService.activeAccount().routingNumber }} | Branch: {{ accountService.activeAccount().bankBranch }}</div>
                </div>
              </div>

              <div class="doc-meta">
                <div class="doc-type-title">
                  {{ selectedTemplate() === 'TAX' ? 'TAX & INTEREST SUMMARY' : 'ACCOUNT STATEMENT' }}
                </div>
                <div class="doc-meta-line">Period: <strong>{{ txService.filter().startDate }}</strong> to <strong>{{ txService.filter().endDate }}</strong></div>
                <div class="doc-meta-line">Date Issued: <strong>2026-07-29</strong></div>
              </div>
            </div>

            <!-- Customer & Account Info Block -->
            <div class="doc-info-grid">
              <div class="info-block">
                <div class="info-block-title">ACCOUNT HOLDER INFORMATION</div>
                <div class="info-row"><span>Name:</span> <strong>{{ accountService.activeAccount().holderName }}</strong></div>
                <div class="info-row"><span>SSN / Tax ID:</span> <strong>{{ accountService.maskTaxId(accountService.activeAccount().holderSSN) }}</strong></div>
                <div class="info-row"><span>Ownership Rights:</span> <strong>{{ accountService.activeAccount().ownershipStatus }}</strong></div>
              </div>

              <div class="info-block">
                <div class="info-block-title">ACCOUNT SPECIFICATIONS</div>
                <div class="info-row"><span>Account Name:</span> <strong>{{ accountService.activeAccount().name }}</strong></div>
                <div class="info-row"><span>Account Number:</span> <strong>{{ accountService.maskAccountNumber(accountService.activeAccount().accountNumber) }}</strong></div>
                <div class="info-row"><span>Currency:</span> <strong>{{ accountService.activeAccount().currency }} ($)</strong></div>
              </div>
            </div>

            <!-- Summary Table Grid -->
            <div class="doc-summary-box">
              <div class="summary-col">
                <span class="sc-label">OPENING BALANCE</span>
                <span class="sc-val">{{ accountService.formatCurrency(calcService.summary().openingBalance) }}</span>
              </div>
              <div class="summary-col">
                <span class="sc-label">TOTAL CREDITS (+)</span>
                <span class="sc-val text-green">+{{ accountService.formatCurrency(calcService.summary().totalCredits) }}</span>
              </div>
              <div class="summary-col">
                <span class="sc-label">TOTAL DEBITS (-)</span>
                <span class="sc-val text-red">-{{ accountService.formatCurrency(calcService.summary().totalDebits) }}</span>
              </div>
              <div class="summary-col">
                <span class="sc-label">NET FEES / INTEREST</span>
                <span class="sc-val">{{ accountService.formatCurrency(calcService.summary().totalInterest - calcService.summary().totalFees) }}</span>
              </div>
              <div class="summary-col highlight">
                <span class="sc-label">CLOSING BALANCE</span>
                <span class="sc-val text-bold">{{ accountService.formatCurrency(calcService.summary().closingBalance) }}</span>
              </div>
            </div>

            <!-- Transaction Table -->
            <table class="doc-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference ID</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th class="text-right">Amount</th>
                  <th class="text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of txService.filteredTransactions()">
                  <td>{{ t.date }}</td>
                  <td class="font-mono">{{ t.referenceId }}</td>
                  <td>{{ t.description }}</td>
                  <td>{{ t.category }}</td>
                  <td class="text-right font-bold" [ngClass]="t.type === 'CREDIT' || t.type === 'INTEREST' ? 'text-green' : ''">
                    {{ t.type === 'CREDIT' || t.type === 'INTEREST' ? '+' : '-' }}{{ accountService.formatCurrency(t.amount) }}
                  </td>
                  <td class="text-right font-mono">{{ accountService.formatCurrency(t.balanceAfter) }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Page Watermark & Security Footer -->
            <div class="doc-watermark-footer">
              <div class="confidential-tag">🔒 OFFICIAL ENCRYPTED FINCORE BANK RECORD — CONFIDENTIAL</div>
              <div class="page-count">Page 1 of 1</div>
            </div>
          </div>
        </div>

        <!-- Modal Bottom Bar Export Action Toolbar -->
        <div class="modal-footer">
          <div class="export-options">
            <label class="pw-check">
              <input type="checkbox" [checked]="isPasswordProtected()" (change)="togglePasswordProtected()" />
              <span>Password Protect Export PDF</span>
            </label>
          </div>

          <div class="action-buttons">
            <button type="button" class="btn-secondary" (click)="exportExcel()">
              Export Excel
            </button>
            <button type="button" class="btn-primary" (click)="downloadPdf()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF Statement
            </button>
            <button type="button" class="btn-email" (click)="triggerEmailOpen()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email Statement
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-container {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 16px;
      width: 100%;
      max-width: 1040px;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      overflow: hidden;
    }
    .modal-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #1e293b;
    }
    .modal-title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #60a5fa;
    }
    .modal-title-group h3 {
      font-size: 0.95rem;
      font-weight: 800;
      color: #f8fafc;
      margin: 0;
    }
    .modal-subtitle {
      font-size: 0.7rem;
      color: #94a3b8;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .template-switcher {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #cbd5e1;
    }
    .template-switcher select {
      background: #0f172a;
      border: 1px solid #475569;
      color: #ffffff;
      padding: 0.35rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
    .close-btn:hover {
      color: #ffffff;
      background: #334155;
    }
    .document-preview-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      background: #090d16;
      display: flex;
      justify-content: center;
    }
    .bank-document-sheet {
      background: #ffffff;
      color: #0f172a;
      width: 100%;
      max-width: 820px;
      padding: 2.5rem;
      border-radius: 4px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      font-family: 'Helvetica Neue', Arial, sans-serif;
    }
    .bank-document-sheet.template-executive {
      border-top: 6px solid #1e293b;
    }
    .bank-document-sheet.template-tax {
      border-top: 6px solid #0f766e;
    }
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }
    .bank-symbol {
      background: #0f172a;
      color: #ffffff;
      font-size: 0.85rem;
      font-weight: 900;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      margin-bottom: 0.4rem;
      display: inline-block;
    }
    .doc-bank-name {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .doc-bank-sub {
      font-size: 0.65rem;
      color: #64748b;
      font-weight: 700;
    }
    .doc-branch {
      font-size: 0.65rem;
      color: #475569;
    }
    .doc-type-title {
      font-size: 1.1rem;
      font-weight: 800;
      text-align: right;
      color: #1e293b;
    }
    .doc-meta-line {
      font-size: 0.72rem;
      color: #475569;
      text-align: right;
    }

    .doc-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      margin-bottom: 1.5rem;
    }
    .info-block-title {
      font-size: 0.7rem;
      font-weight: 800;
      color: #64748b;
      margin-bottom: 0.4rem;
      letter-spacing: 0.5px;
    }
    .info-row {
      font-size: 0.78rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.2rem;
    }
    .info-row span { color: #64748b; }

    .doc-summary-box {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f1f5f9;
      margin-bottom: 1.5rem;
      overflow: hidden;
    }
    .summary-col {
      padding: 0.75rem 0.5rem;
      text-align: center;
      border-right: 1px solid #cbd5e1;
    }
    .summary-col:last-child { border-right: none; }
    .summary-col.highlight { background: #e2e8f0; }
    .sc-label {
      display: block;
      font-size: 0.62rem;
      font-weight: 800;
      color: #64748b;
      margin-bottom: 0.25rem;
    }
    .sc-val {
      font-size: 0.85rem;
      font-weight: 700;
    }
    .text-green { color: #059669; }
    .text-red { color: #dc2626; }
    .text-bold { font-weight: 800; }

    .doc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.75rem;
      margin-bottom: 2rem;
    }
    .doc-table th {
      background: #1e293b;
      color: #ffffff;
      padding: 0.5rem 0.75rem;
      text-align: left;
      font-size: 0.7rem;
    }
    .doc-table td {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    .doc-table tr:nth-child(even) { background: #f8fafc; }
    .text-right { text-align: right; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }

    .doc-watermark-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 0.75rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      color: #94a3b8;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      background: #1e293b;
      border-top: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .pw-check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.78rem;
      color: #cbd5e1;
      cursor: pointer;
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .btn-secondary {
      background: #0f172a;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 0.5rem 0.85rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-secondary:hover {
      background: #334155;
      color: #ffffff;
    }
    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .btn-email {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
    }
  `]
})
export class StatementPreviewModalComponent {
  exportPdfService = inject(ExportPdfService);
  exportDataService = inject(ExportDataService);
  accountService = inject(AccountService);
  txService = inject(TransactionService);
  calcService = inject(FinancialCalculationService);
  deliveryService = inject(DeliveryStorageService);

  readonly close = output<void>();
  readonly openEmailModal = output<void>();

  readonly selectedTemplate = signal<StatementTemplate>('CLASSIC');
  readonly isPasswordProtected = signal<boolean>(false);

  closeModal() {
    this.close.emit();
  }

  onTemplateChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedTemplate.set(select.value as StatementTemplate);
  }

  togglePasswordProtected() {
    this.isPasswordProtected.update(v => !v);
  }

  downloadPdf() {
    const tmpl = this.selectedTemplate();
    const isPw = this.isPasswordProtected();
    this.exportPdfService.downloadPdf(tmpl, isPw);

    const filter = this.txService.filter();
    this.deliveryService.saveToArchive(
      `${filter.startDate} to ${filter.endDate}`,
      filter.startDate,
      filter.endDate,
      'PDF',
      isPw
    );
  }

  exportCsv() {
    this.exportDataService.exportToCsv();
    const filter = this.txService.filter();
    this.deliveryService.saveToArchive(
      `${filter.startDate} to ${filter.endDate}`,
      filter.startDate,
      filter.endDate,
      'CSV',
      false
    );
  }

  exportExcel() {
    this.exportDataService.exportToExcel();
    const filter = this.txService.filter();
    this.deliveryService.saveToArchive(
      `${filter.startDate} to ${filter.endDate}`,
      filter.startDate,
      filter.endDate,
      'EXCEL',
      false
    );
  }

  exportJson() {
    this.exportDataService.exportToJson();
    const filter = this.txService.filter();
    this.deliveryService.saveToArchive(
      `${filter.startDate} to ${filter.endDate}`,
      filter.startDate,
      filter.endDate,
      'JSON',
      false
    );
  }

  triggerEmailOpen() {
    this.openEmailModal.emit();
  }
}
