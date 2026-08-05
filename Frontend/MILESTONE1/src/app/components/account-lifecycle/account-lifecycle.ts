import { Component, inject, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { DeliveryStorageService } from '../../services/delivery-storage.service';
import { AccountStatus, OnboardingForm, MonthlyBalancePoint } from '../../models/banking.models';

@Component({
  selector: 'app-account-lifecycle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="lifecycle-view">
      <div class="view-header">
        <div>
          <h2 class="view-title">ACCOUNT LIFECYCLE & HISTORICAL PERFORMANCE GRAPH</h2>
          <div class="view-subtitle">Lifecycle state matrix, 12-month balance progression chart & onboarding stepper</div>
        </div>

        <div class="header-btns">
          <button type="button" class="btn-new-account" (click)="showOnboardingModal = true">
            + Open New Account (Stepper)
          </button>
        </div>
      </div>

      <!-- 1. Interactive 12-Month Historical Balance SVG Graph Section -->
      <div class="graph-card">
        <div class="graph-header">
          <div>
            <div class="g-title">12-MONTH HISTORICAL BALANCE TRAJECTORY GRAPH</div>
            <div class="g-sub">
              Showing monthly balance progression for 
              <strong class="text-blue">{{ accountService.activeAccount().name }}</strong> 
              ({{ accountService.maskAccountNumber(accountService.activeAccount().accountNumber) }})
            </div>
          </div>

          <!-- Growth Rate Pill -->
          <div class="growth-pill" [class.positive]="accountService.activeAccount().netGrowthRate >= 0">
            <span>{{ accountService.activeAccount().netGrowthRate >= 0 ? '▲ +' : '▼ ' }}{{ accountService.activeAccount().netGrowthRate }}% Net Growth</span>
          </div>
        </div>

        <!-- Metric Highlights Banner -->
        <div class="graph-metrics-banner">
          <div class="gm-item">
            <span class="gm-label">CURRENT BALANCE</span>
            <span class="gm-val font-mono">$ {{ accountService.activeAccount().balance.toFixed(2) }}</span>
          </div>
          <div class="gm-item">
            <span class="gm-label">12-MONTH PEAK (HIGHEST)</span>
            <span class="gm-val text-green font-mono">$ {{ peakBalance().toFixed(2) }}</span>
          </div>
          <div class="gm-item">
            <span class="gm-label">12-MONTH LOWEST TROUGH</span>
            <span class="gm-val text-amber font-mono">$ {{ troughBalance().toFixed(2) }}</span>
          </div>
          <div class="gm-item">
            <span class="gm-label">AVG MONTHLY INFLOW</span>
            <span class="gm-val text-blue font-mono">$ {{ avgInflow().toFixed(2) }}</span>
          </div>
        </div>

        <!-- SVG Interactive Line/Area Graph -->
        <div class="svg-container">
          <svg viewBox="0 0 800 220" class="balance-svg">
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
              </linearGradient>
            </defs>

            <!-- Background Grid Lines -->
            <line x1="40" y1="30" x2="780" y2="30" stroke="#1f2937" stroke-width="1" stroke-dasharray="4"/>
            <line x1="40" y1="80" x2="780" y2="80" stroke="#1f2937" stroke-width="1" stroke-dasharray="4"/>
            <line x1="40" y1="130" x2="780" y2="130" stroke="#1f2937" stroke-width="1" stroke-dasharray="4"/>
            <line x1="40" y1="180" x2="780" y2="180" stroke="#1f2937" stroke-width="1"/>

            <!-- Area Path -->
            <path [attr.d]="svgAreaPath()" fill="url(#balanceGrad)" />

            <!-- Line Path -->
            <path [attr.d]="svgLinePath()" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

            <!-- Data Point Circles with Tooltips -->
            <g *ngFor="let pt of chartPoints()">
              <circle 
                [attr.cx]="pt.x" 
                [attr.cy]="pt.y" 
                r="5" 
                fill="#0f172a" 
                stroke="#38bdf8" 
                stroke-width="2.5" 
                class="chart-dot"
              >
                <title>{{ pt.month }}: $ {{ pt.balance.toFixed(2) }} (Inflow: $ {{ pt.inflow }})</title>
              </circle>

              <!-- Month Label -->
              <text [attr.x]="pt.x" y="202" fill="#9ca3af" font-size="10" text-anchor="middle" font-family="sans-serif">
                {{ pt.month }}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <!-- 2. Account Search & Status Filter Controls -->
      <div class="account-list-card">
        <div class="card-header-bar">
          <div>
            <h3>ALL SYSTEM ACCOUNTS (LIFECYCLE MATRIX)</h3>
            <div class="card-header-sub">Filter accounts by lifecycle state or search by account number</div>
          </div>

          <!-- Status Pills & Search Input -->
          <div class="filter-controls">
            <div class="search-box-sm">
              <input type="text" [(ngModel)]="searchQuery" placeholder="Search account or name..." class="f-input-sm" />
            </div>

            <div class="status-pills">
              <button type="button" class="s-pill" [class.active]="statusFilter() === 'ALL'" (click)="statusFilter.set('ALL')">ALL ({{ accountService.accounts().length }})</button>
              <button type="button" class="s-pill" [class.active]="statusFilter() === 'ACTIVE'" (click)="statusFilter.set('ACTIVE')">ACTIVE</button>
              <button type="button" class="s-pill" [class.active]="statusFilter() === 'PENDING_VERIFICATION'" (click)="statusFilter.set('PENDING_VERIFICATION')">PENDING</button>
              <button type="button" class="s-pill" [class.active]="statusFilter() === 'DORMANT'" (click)="statusFilter.set('DORMANT')">DORMANT</button>
              <button type="button" class="s-pill" [class.active]="statusFilter() === 'FROZEN'" (click)="statusFilter.set('FROZEN')">FROZEN</button>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="lifecycle-table">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Account Name</th>
                <th>Category</th>
                <th>Balance</th>
                <th>Net Growth</th>
                <th>Lifecycle Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let acc of filteredAccounts()" [class.selected-row]="acc.id === accountService.activeAccountId()">
                <td class="font-mono font-bold">{{ accountService.maskAccountNumber(acc.accountNumber) }}</td>
                <td>
                  <div class="acc-holder">{{ acc.holderName }}</div>
                  <div class="acc-name-sub">{{ acc.name }}</div>
                </td>
                <td><span class="cat-chip">{{ acc.type }}</span></td>
                <td class="font-mono font-bold">$ {{ acc.balance.toFixed(2) }}</td>
                <td class="font-mono font-bold" [class.text-green]="acc.netGrowthRate >= 0" [class.text-amber]="acc.netGrowthRate < 0">
                  {{ acc.netGrowthRate >= 0 ? '+' : '' }}{{ acc.netGrowthRate }}%
                </td>
                <td>
                  <span class="status-badge" [ngClass]="acc.status.toLowerCase()">
                    ● {{ acc.status }}
                  </span>
                </td>
                <td>
                  <div class="action-dropdown-group">
                    <button type="button" class="btn-sm" (click)="accountService.selectAccount(acc.id)">Select Graph</button>
                    <button type="button" class="btn-sm edit" (click)="triggerEdit(acc.id)">Edit</button>
                    <select 
                      [ngModel]="acc.status" 
                      (ngModelChange)="changeStatus(acc.id, $event)"
                      class="status-select-sm"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PENDING_VERIFICATION">PENDING</option>
                      <option value="DORMANT">DORMANT</option>
                      <option value="FROZEN">FROZEN</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </td>
              </tr>

              <tr *ngIf="filteredAccounts().length === 0">
                <td colspan="7" class="empty-msg">No accounts match the selected status filter or search query.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. Account Closure Eligibility Service Section -->
      <div class="closure-card">
        <h3>🔒 ACCOUNT CLOSURE ELIGIBILITY SERVICE</h3>
        <div class="closure-body">
          <div class="closure-info">
            <div class="ci-line">Selected Account: <strong>{{ accountService.activeAccount().name }} ({{ accountService.activeAccount().accountNumber }})</strong></div>
            <div class="ci-line">Current Balance: <strong [class.text-red]="accountService.activeAccount().balance !== 0">$ {{ accountService.activeAccount().balance.toFixed(2) }}</strong></div>
            <div class="ci-line">Active Holds: <strong>{{ accountService.activeAccount().holds.length }}</strong></div>
          </div>

          <div class="closure-payout" *ngIf="accountService.activeAccount().balance > 0">
            <label>Settlement & Payout Transfer Method:</label>
            <select [(ngModel)]="payoutMethod" class="f-select">
              <option value="WIRE">Wire Transfer to External Bank</option>
              <option value="CHECK">Issue Cashier's Official Check</option>
              <option value="INTERNAL">Internal Transfer to Active Account</option>
            </select>
          </div>

          <button type="button" class="btn-close-account" (click)="attemptClosure()">
            Execute Account Closure
          </button>
        </div>
      </div>

      <!-- Multi-Step Onboarding Stepper Modal -->
      <div class="modal-backdrop" *ngIf="showOnboardingModal" (click)="showOnboardingModal = false">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>NEW CUSTOMER ACCOUNT ONBOARDING STEPPER</h3>
            <button type="button" class="close-btn" (click)="showOnboardingModal = false">✕</button>
          </div>

          <!-- Stepper Progress Header -->
          <div class="stepper-header">
            <div class="step-item" [class.active]="step() === 1" [class.done]="step() > 1">
              <div class="step-num">1</div>
              <div class="step-text">Personal Details</div>
            </div>
            <div class="step-line"></div>
            <div class="step-item" [class.active]="step() === 2" [class.done]="step() > 2">
              <div class="step-num">2</div>
              <div class="step-text">Account Category</div>
            </div>
            <div class="step-line"></div>
            <div class="step-item" [class.active]="step() === 3" [class.done]="step() > 3">
              <div class="step-num">3</div>
              <div class="step-text">Initial Deposit</div>
            </div>
            <div class="step-line"></div>
            <div class="step-item" [class.active]="step() === 4">
              <div class="step-num">4</div>
              <div class="step-text">Confirmation</div>
            </div>
          </div>

          <div class="stepper-body">
            <!-- Step 1: Personal Details -->
            <div *ngIf="step() === 1" class="step-content">
              <div class="f-group">
                <label>Full Legal Name</label>
                <input type="text" [(ngModel)]="form.fullName" placeholder="e.g. Eleanor Vance" class="f-input" />
              </div>
              <div class="f-grid-2">
                <div class="f-group">
                  <label>Email Address</label>
                  <input type="email" [(ngModel)]="form.email" placeholder="eleanor@example.com" class="f-input" />
                </div>
                <div class="f-group">
                  <label>Phone Number</label>
                  <input type="text" [(ngModel)]="form.phone" placeholder="+1 (555) 000-1122" class="f-input" />
                </div>
              </div>
              <div class="f-group">
                <label>SSN / Tax Identification Number</label>
                <input type="text" [(ngModel)]="form.ssn" placeholder="987-65-4321" class="f-input" />
              </div>
              <div class="f-group">
                <label>Mailing Address</label>
                <input type="text" [(ngModel)]="form.address" placeholder="100 Broadway, NY 10005" class="f-input" />
              </div>
            </div>

            <!-- Step 2: Account Category -->
            <div *ngIf="step() === 2" class="step-content">
              <label class="form-label">Select Account Category</label>
              <div class="category-cards">
                <label class="cat-card" [class.selected]="form.accountType === 'SAVINGS'">
                  <input type="radio" name="accCat" value="SAVINGS" [(ngModel)]="form.accountType" />
                  <div>
                    <div class="cat-title">Savings Account</div>
                    <div class="cat-sub">High yield annual interest, ideal for personal reserve.</div>
                  </div>
                </label>

                <label class="cat-card" [class.selected]="form.accountType === 'CHECKING'">
                  <input type="radio" name="accCat" value="CHECKING" [(ngModel)]="form.accountType" />
                  <div>
                    <div class="cat-title">Premier Checking</div>
                    <div class="cat-sub">Unlimited debit transactions, checkbooks, and bill pay.</div>
                  </div>
                </label>

                <label class="cat-card" [class.selected]="form.accountType === 'JOINT'">
                  <input type="radio" name="accCat" value="JOINT" [(ngModel)]="form.accountType" />
                  <div>
                    <div class="cat-title">Joint Account</div>
                    <div class="cat-sub">Shared ownership account for families or trustees.</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Step 3: Initial Deposit -->
            <div *ngIf="step() === 3" class="step-content">
              <div class="f-group">
                <label>Initial Opening Deposit ($ USD)</label>
                <input type="number" [(ngModel)]="form.initialDeposit" class="f-input" min="100" />
              </div>

              <div class="f-group">
                <label>Minimum Balance Alert Threshold ($)</label>
                <input type="number" [(ngModel)]="form.minBalanceThreshold" class="f-input" />
              </div>

              <label class="check-group">
                <input type="checkbox" [(ngModel)]="form.overdraftOptIn" />
                <span>Opt-in for Overdraft Protection ($500 limit)</span>
              </label>
            </div>

            <!-- Step 4: Confirmation -->
            <div *ngIf="step() === 4" class="step-content">
              <div class="confirm-summary">
                <div class="cs-row"><span>Account Holder:</span> <strong>{{ form.fullName }}</strong></div>
                <div class="cs-row"><span>Account Category:</span> <strong>{{ form.accountType }}</strong></div>
                <div class="cs-row"><span>Opening Deposit:</span> <strong class="text-green">$ {{ form.initialDeposit.toFixed(2) }}</strong></div>
                <div class="cs-row"><span>Generated Account #:</span> <strong class="font-mono text-blue">AUTO_GENERATED (1234-5678-XXXX)</strong></div>
                <div class="cs-row"><span>Initial Status:</span> <strong class="text-amber">PENDING_VERIFICATION</strong></div>
              </div>
            </div>
          </div>

          <div class="stepper-footer">
            <button type="button" class="btn-prev" *ngIf="step() > 1" (click)="step.set(step() - 1)">Previous</button>
            <button type="button" class="btn-next" *ngIf="step() < 4" (click)="step.set(step() + 1)">Next Step</button>
            <button type="button" class="btn-finish" *ngIf="step() === 4" (click)="submitOnboarding()">
              ✓ Complete Onboarding & Open Account
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lifecycle-view { color: #ffffff; }
    .view-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .view-title { font-size: 1.4rem; font-weight: 800; margin: 0; }
    .view-subtitle { font-size: 0.8rem; color: #94a3b8; }
    .btn-new-account {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      border: none;
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-weight: 800;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .graph-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .graph-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .g-title { font-size: 0.95rem; font-weight: 800; color: #f3f4f6; }
    .g-sub { font-size: 0.75rem; color: #9ca3af; }
    .growth-pill {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 800;
    }
    .growth-pill.positive {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.3);
      color: #34d399;
    }

    .graph-metrics-banner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      background: #0f172a;
      padding: 0.85rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border: 1px solid #1e293b;
    }
    .gm-item { display: flex; flex-direction: column; gap: 0.2rem; }
    .gm-label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; }
    .gm-val { font-size: 1.1rem; font-weight: 800; color: #ffffff; }

    .svg-container { width: 100%; height: 210px; }
    .balance-svg { width: 100%; height: 100%; }
    .chart-dot { cursor: pointer; transition: r 0.2s ease; }
    .chart-dot:hover { r: 8; fill: #38bdf8; }

    .account-list-card, .closure-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 10px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .card-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .card-header-bar h3, .closure-card h3 {
      font-size: 0.95rem;
      font-weight: 800;
      color: #f3f4f6;
      margin: 0;
    }
    .card-header-sub { font-size: 0.72rem; color: #9ca3af; }

    .filter-controls { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .f-input-sm {
      background: #0f172a;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      font-size: 0.78rem;
    }
    .status-pills { display: flex; gap: 0.35rem; }
    .s-pill {
      background: #0f172a;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 0.3rem 0.65rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      cursor: pointer;
    }
    .s-pill.active { background: #2563eb; color: #ffffff; border-color: #3b82f6; }

    .table-responsive { overflow-x: auto; }
    .lifecycle-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
    .lifecycle-table th { background: #1f2937; color: #9ca3af; padding: 0.6rem 0.85rem; text-align: left; font-size: 0.72rem; }
    .lifecycle-table td { padding: 0.75rem 0.85rem; border-bottom: 1px solid #1f2937; color: #e5e7eb; }
    .selected-row { background: rgba(56, 189, 248, 0.08); }
    .acc-holder { font-weight: 700; color: #ffffff; }
    .acc-name-sub { font-size: 0.7rem; color: #6b7280; }
    .cat-chip { background: #1f2937; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; }

    .status-badge { display: inline-block; padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800; }
    .status-badge.active { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .status-badge.pending_verification { background: rgba(245, 158, 11, 0.2); color: #fde047; }
    .status-badge.dormant { background: rgba(107, 114, 128, 0.2); color: #9ca3af; }
    .status-badge.frozen { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    .status-badge.closed { background: rgba(239, 68, 68, 0.3); color: #ef4444; }

    .action-dropdown-group { display: flex; gap: 0.4rem; align-items: center; }
    .btn-sm { background: #1f2937; border: 1px solid #374151; color: #cbd5e1; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.72rem; cursor: pointer; }
    .btn-sm.edit { border-color: #3b82f6; color: #60a5fa; }
    .status-select-sm { background: #0f172a; border: 1px solid #334155; color: #ffffff; padding: 0.25rem 0.4rem; border-radius: 4px; font-size: 0.7rem; }
    .empty-msg { text-align: center; padding: 1.5rem; color: #6b7280; }

    .closure-body { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.85rem; }
    .closure-info { display: flex; gap: 2rem; font-size: 0.85rem; }
    .ci-line span { color: #9ca3af; }
    .text-red { color: #f87171; }
    .text-green { color: #34d399; }
    .text-amber { color: #fbbf24; }
    .text-blue { color: #38bdf8; }
    .closure-payout { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8rem; }
    .f-select { background: #1f2937; border: 1px solid #374151; color: #ffffff; padding: 0.5rem; border-radius: 6px; width: 320px; }
    .btn-close-account { background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 0.6rem 1.25rem; border-radius: 6px; font-weight: 800; font-size: 0.8rem; cursor: pointer; align-self: flex-start; }

    /* Modal Stepper */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); z-index: 1200; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .modal-container { background: #111827; border: 1px solid #1f2937; border-radius: 16px; width: 100%; max-width: 650px; padding: 1.5rem; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
    .modal-header h3 { font-size: 1rem; font-weight: 800; margin: 0; color: #ffffff; }
    .close-btn { background: none; border: none; color: #9ca3af; font-size: 1.2rem; cursor: pointer; }

    .stepper-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding: 0.75rem; background: #0f172a; border-radius: 10px; }
    .step-item { display: flex; align-items: center; gap: 0.4rem; opacity: 0.5; }
    .step-item.active { opacity: 1; color: #38bdf8; }
    .step-item.done { opacity: 1; color: #34d399; }
    .step-num { width: 24px; height: 24px; border-radius: 50%; background: #1f2937; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; }
    .step-text { font-size: 0.75rem; font-weight: 700; }
    .step-line { flex: 1; height: 1px; background: #334155; margin: 0 0.5rem; }

    .stepper-body { margin-bottom: 1.5rem; min-height: 220px; }
    .step-content { display: flex; flex-direction: column; gap: 1rem; }
    .f-group { display: flex; flex-direction: column; gap: 0.3rem; }
    .f-group label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; }
    .f-input { background: #1f2937; border: 1px solid #374151; color: #ffffff; padding: 0.6rem; border-radius: 6px; font-size: 0.85rem; }
    .f-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .category-cards { display: flex; flex-direction: column; gap: 0.75rem; }
    .cat-card { display: flex; gap: 0.85rem; background: #1f2937; border: 1px solid #374151; padding: 0.85rem; border-radius: 8px; cursor: pointer; }
    .cat-card.selected { border-color: #38bdf8; background: rgba(56, 189, 248, 0.1); }
    .cat-title { font-weight: 700; font-size: 0.85rem; }
    .cat-sub { font-size: 0.72rem; color: #9ca3af; }

    .confirm-summary { background: #0f172a; padding: 1rem; border-radius: 8px; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; }
    .cs-row { display: flex; justify-content: space-between; }
    .cs-row span { color: #9ca3af; }

    .stepper-footer { display: flex; justify-content: space-between; gap: 1rem; }
    .btn-prev { background: #1f2937; border: 1px solid #374151; color: #cbd5e1; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
    .btn-next { background: #2563eb; color: #ffffff; border: none; padding: 0.5rem 1.25rem; border-radius: 6px; font-weight: 700; cursor: pointer; margin-left: auto; }
    .btn-finish { background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; border: none; padding: 0.5rem 1.25rem; border-radius: 6px; font-weight: 800; cursor: pointer; margin-left: auto; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
  `]
})
export class AccountLifecycleComponent {
  accountService = inject(AccountService);
  deliveryService = inject(DeliveryStorageService);

  readonly openEditModalTrigger = output<string>();

  statusFilter = signal<string>('ALL');
  searchQuery = '';
  showOnboardingModal = false;
  step = signal<number>(1);
  payoutMethod = 'WIRE';

  form: OnboardingForm = {
    fullName: '',
    email: '',
    phone: '',
    ssn: '',
    address: '',
    accountType: 'SAVINGS',
    initialDeposit: 500,
    overdraftOptIn: true,
    minBalanceThreshold: 200
  };

  // Compute Filtered Accounts List
  readonly filteredAccounts = computed(() => {
    const filter = this.statusFilter();
    const q = this.searchQuery.toLowerCase().trim();
    return this.accountService.accounts().filter(acc => {
      if (filter !== 'ALL' && acc.status !== filter) return false;
      if (q) {
        const matchesName = acc.holderName.toLowerCase().includes(q) || acc.name.toLowerCase().includes(q);
        const matchesNo = acc.accountNumber.includes(q);
        if (!matchesName && !matchesNo) return false;
      }
      return true;
    });
  });

  // Graph Calculations for Active Account
  readonly history = computed(() => this.accountService.activeAccount().history || []);

  readonly peakBalance = computed(() => {
    const h = this.history();
    if (h.length === 0) return this.accountService.activeAccount().balance;
    return Math.max(...h.map(item => item.balance));
  });

  readonly troughBalance = computed(() => {
    const h = this.history();
    if (h.length === 0) return this.accountService.activeAccount().balance;
    return Math.min(...h.map(item => item.balance));
  });

  readonly avgInflow = computed(() => {
    const h = this.history();
    if (h.length === 0) return 0;
    const sum = h.reduce((acc, item) => acc + item.inflow, 0);
    return sum / h.length;
  });

  readonly chartPoints = computed(() => {
    const h = this.history();
    if (h.length === 0) return [];
    const minB = Math.min(...h.map(item => item.balance));
    const maxB = Math.max(...h.map(item => item.balance));
    const range = maxB - minB || 1;

    const startX = 50;
    const endX = 750;
    const stepX = (endX - startX) / Math.max(1, h.length - 1);

    return h.map((item, idx) => {
      const x = startX + idx * stepX;
      // y-axis mapping: 180 (bottom) to 30 (top)
      const norm = (item.balance - minB) / range;
      const y = 170 - norm * 130;
      return {
        x,
        y,
        month: item.month,
        balance: item.balance,
        inflow: item.inflow
      };
    });
  });

  readonly svgLinePath = computed(() => {
    const pts = this.chartPoints();
    if (pts.length === 0) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  });

  readonly svgAreaPath = computed(() => {
    const line = this.svgLinePath();
    if (!line) return '';
    const pts = this.chartPoints();
    const lastX = pts[pts.length - 1].x;
    const firstX = pts[0].x;
    return `${line} L ${lastX} 180 L ${firstX} 180 Z`;
  });

  changeStatus(id: string, newStatus: AccountStatus) {
    this.accountService.updateAccountStatus(id, newStatus);
    this.deliveryService.showToast(
      'Account Lifecycle Status Transition',
      `Account updated to ${newStatus}.`,
      newStatus === 'FROZEN' || newStatus === 'CLOSED' ? 'warning' : 'success'
    );
  }

  triggerEdit(accountId: string) {
    this.openEditModalTrigger.emit(accountId);
  }

  submitOnboarding() {
    if (!this.form.fullName) return;
    const created = this.accountService.createAccount(this.form);
    this.deliveryService.showToast(
      'Account Created Successfully',
      `Assigned Account #: ${created.accountNumber}. Initial deposit $${created.balance.toFixed(2)} credited.`
    );
    this.showOnboardingModal = false;
    this.step.set(1);
  }

  attemptClosure() {
    const acc = this.accountService.activeAccount();
    const result = this.accountService.closeAccount(acc.id);
    this.deliveryService.showToast(
      result.success ? 'Account Closed' : 'Closure Verification Failed',
      result.message,
      result.success ? 'success' : 'warning'
    );
  }
}
