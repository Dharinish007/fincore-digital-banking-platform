import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { Transaction } from '../../models/banking.models';

@Component({
  selector: 'app-transaction-table',
  imports: [CommonModule],
  template: `
    <div class="table-card">
      <div class="table-header">
        <div class="table-title-group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <h3>STATEMENT TRANSACTIONS LEDGER</h3>
          <span class="count-badge">{{ txService.filteredTransactions().length }} Records</span>
        </div>

        <div class="page-size-selector">
          <label>Rows per page:</label>
          <select [value]="pageSize()" (change)="onPageSizeChange($event)">
            <option [value]="5">5 rows</option>
            <option [value]="10">10 rows</option>
            <option [value]="25">25 rows</option>
          </select>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="banking-table">
          <thead>
            <tr>
              <th (click)="sort('date')" class="sortable">
                Date
                <span class="sort-icon" *ngIf="sortField() === 'date'">{{ sortAsc() ? '▲' : '▼' }}</span>
              </th>
              <th>Ref ID</th>
              <th (click)="sort('description')" class="sortable">
                Description
                <span class="sort-icon" *ngIf="sortField() === 'description'">{{ sortAsc() ? '▲' : '▼' }}</span>
              </th>
              <th>Category</th>
              <th>Type</th>
              <th (click)="sort('amount')" class="sortable text-right">
                Amount
                <span class="sort-icon" *ngIf="sortField() === 'amount'">{{ sortAsc() ? '▲' : '▼' }}</span>
              </th>
              <th class="text-right">Balance After</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of paginatedTransactions()" class="table-row">
              <td class="cell-date">{{ t.date }}</td>
              <td class="cell-ref font-mono">{{ t.referenceId }}</td>
              <td class="cell-desc">
                <div class="desc-main">{{ t.description }}</div>
                <div class="desc-sub" *ngIf="t.merchantName">{{ t.merchantName }}</div>
              </td>
              <td><span class="cat-pill">{{ t.category }}</span></td>
              <td>
                <span class="type-badge" [ngClass]="t.type.toLowerCase()">
                  {{ t.type.replace('_', ' ') }}
                </span>
              </td>
              <td class="text-right font-bold" [ngClass]="t.type === 'CREDIT' || t.type === 'INTEREST' ? 'amount-credit' : 'amount-debit'">
                {{ t.type === 'CREDIT' || t.type === 'INTEREST' ? '+' : '-' }}
                {{ accountService.formatCurrency(t.amount) }}
              </td>
              <td class="text-right font-mono font-bold cell-balance">
                {{ accountService.formatCurrency(t.balanceAfter) }}
              </td>
              <td>
                <span class="status-chip completed">
                  <span class="dot"></span> {{ t.status }}
                </span>
              </td>
            </tr>

            <tr *ngIf="paginatedTransactions().length === 0">
              <td colspan="8" class="empty-state">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div class="empty-title">No transactions match the selected date or filter criteria.</div>
                <div class="empty-sub">Try expanding your date range or clearing category filters.</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-bar">
        <div class="pagination-info">
          Showing <strong>{{ pageStartIndex() + 1 }}</strong> to 
          <strong>{{ pageEndIndex() }}</strong> of 
          <strong>{{ txService.filteredTransactions().length }}</strong> transactions
        </div>

        <div class="pagination-buttons">
          <button 
            type="button" 
            class="page-btn" 
            [disabled]="currentPage() === 1"
            (click)="setPage(currentPage() - 1)"
          >
            Previous
          </button>

          <button 
            *ngFor="let p of pagesArray()"
            type="button" 
            class="page-btn num"
            [class.active]="p === currentPage()"
            (click)="setPage(p)"
          >
            {{ p }}
          </button>

          <button 
            type="button" 
            class="page-btn" 
            [disabled]="currentPage() === totalPages()"
            (click)="setPage(currentPage() + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .table-title-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #60a5fa;
    }
    .table-title-group h3 {
      font-size: 0.88rem;
      font-weight: 800;
      color: #f8fafc;
      margin: 0;
    }
    .count-badge {
      background: rgba(37, 99, 235, 0.2);
      border: 1px solid rgba(37, 99, 235, 0.4);
      color: #93c5fd;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
    }
    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .page-size-selector select {
      background: #0f172a;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
    }
    .table-responsive {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    .banking-table {
      width: 100%;
      border-collapse: collapse;
      background: #0f172a;
      text-align: left;
    }
    .banking-table th {
      background: #1e293b;
      color: #94a3b8;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #334155;
      white-space: nowrap;
    }
    .banking-table th.sortable {
      cursor: pointer;
      user-select: none;
    }
    .banking-table th.sortable:hover {
      color: #ffffff;
    }
    .sort-icon {
      font-size: 0.6rem;
      margin-left: 0.3rem;
      color: #60a5fa;
    }
    .banking-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.8rem;
      color: #e2e8f0;
      vertical-align: middle;
    }
    .table-row:hover {
      background: rgba(255, 255, 255, 0.03);
    }
    .cell-date {
      color: #94a3b8;
      white-space: nowrap;
    }
    .cell-ref {
      color: #64748b;
      font-size: 0.75rem;
    }
    .cell-desc {
      max-width: 260px;
    }
    .desc-main {
      font-weight: 600;
      color: #f1f5f9;
    }
    .desc-sub {
      font-size: 0.68rem;
      color: #64748b;
    }
    .cat-pill {
      background: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
    }
    .type-badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .type-badge.credit { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .type-badge.debit { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
    .type-badge.wire_transfer { background: rgba(59, 130, 246, 0.15); color: #93c5fd; }
    .type-badge.atm_withdrawal { background: rgba(245, 158, 11, 0.15); color: #fde047; }
    .type-badge.fee { background: rgba(236, 72, 153, 0.15); color: #f472b6; }
    .type-badge.interest { background: rgba(139, 92, 246, 0.15); color: #c084fc; }

    .amount-credit { color: #34d399; }
    .amount-debit { color: #f87171; }
    .cell-balance { color: #cbd5e1; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-right { text-align: right; }

    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.68rem;
      font-weight: 700;
      color: #34d399;
    }
    .status-chip .dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem !important;
      color: #64748b;
    }
    .empty-title {
      font-weight: 700;
      color: #cbd5e1;
      margin-top: 0.5rem;
    }
    .empty-sub {
      font-size: 0.75rem;
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .pagination-buttons {
      display: flex;
      gap: 0.35rem;
    }
    .page-btn {
      background: #0f172a;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 0.3rem 0.65rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }
    .page-btn:hover:not(:disabled) {
      border-color: #3b82f6;
      color: #ffffff;
    }
    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .page-btn.num.active {
      background: #2563eb;
      border-color: #60a5fa;
      color: #ffffff;
    }
  `]
})
export class TransactionTableComponent {
  txService = inject(TransactionService);
  accountService = inject(AccountService);

  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly sortField = signal<'date' | 'amount' | 'description'>('date');
  readonly sortAsc = signal<boolean>(false);

  readonly sortedTransactions = computed(() => {
    const raw = [...this.txService.filteredTransactions()];
    const field = this.sortField();
    const asc = this.sortAsc();

    return raw.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === 'date') {
        const timeA = new Date(valA as string).getTime();
        const timeB = new Date(valB as string).getTime();
        return asc ? timeA - timeB : timeB - timeA;
      }
      if (field === 'amount') {
        return asc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
      return asc ? (valA as string).localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
    });
  });

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.sortedTransactions().length / this.pageSize()));
  });

  readonly paginatedTransactions = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.sortedTransactions().slice(start, start + size);
  });

  readonly pageStartIndex = computed(() => (this.currentPage() - 1) * this.pageSize());
  readonly pageEndIndex = computed(() => Math.min(this.currentPage() * this.pageSize(), this.txService.filteredTransactions().length));

  readonly pagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    this.currentPage.set(1);
  }

  setPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) {
      this.currentPage.set(p);
    }
  }

  sort(field: 'date' | 'amount' | 'description') {
    if (this.sortField() === field) {
      this.sortAsc.update(v => !v);
    } else {
      this.sortField.set(field);
      this.sortAsc.set(true);
    }
  }
}
