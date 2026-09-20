import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { FraudCheckService } from '../services/fraud-check.service';

import { FraudCheck } from '../payment-initiation/models/fraud-check.model';

export type FraudTab = 'ALL' | 'Pending' | 'Safe' | 'Suspicious' | 'Blocked';

export type RiskLevel = 'low' | 'medium' | 'high';

@Component({
  selector: 'app-fraud-check',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],

  templateUrl: './fraud-check.component.html',

  styleUrls: ['./fraud-check.component.scss'],
})
export class FraudCheckComponent implements OnInit {
  // =========================================================
  // SIDEBAR
  // =========================================================

  sidebarCollapsed = false;

  // =========================================================
  // FRAUD CHECK DATA
  // =========================================================

  fraudChecks: FraudCheck[] = [];

  filteredFraudChecks: FraudCheck[] = [];

  // =========================================================
  // FILTERS
  // =========================================================

  activeTab: FraudTab = 'ALL';

  searchQuery = '';

  // =========================================================
  // APPROVE MODAL
  // =========================================================

  selectedForApprove: FraudCheck | null = null;

  showApproveModal = false;

  // =========================================================
  // BLOCK MODAL
  // =========================================================

  selectedForBlock: FraudCheck | null = null;

  showBlockModal = false;

  blockRemarks = '';

  // =========================================================
  // TOAST
  // =========================================================

  toastMessage: string | null = null;

  toastType: 'success' | 'warning' | 'error' = 'success';

  constructor(private fraudCheckService: FraudCheckService) {}

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  ngOnInit(): void {
    this.loadFraudChecks();
  }

  // =========================================================
  // LOAD DATA FROM BACKEND
  // =========================================================

  loadFraudChecks(): void {
    this.fraudCheckService.getFraudChecks().subscribe({
      next: (data: FraudCheck[]) => {
        console.log('Fraud checks loaded from backend:', data);

        this.fraudChecks = data;

        this.applyFilter();
      },

      error: (error) => {
        console.error('Error loading fraud checks:', error);

        this.fraudChecks = [];

        this.filteredFraudChecks = [];

        this.showToast('Failed to load fraud check records.', 'error');
      },
    });
  }

  // =========================================================
  // SIDEBAR
  // =========================================================

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // =========================================================
  // TAB FILTER
  // =========================================================

  setTab(tab: FraudTab): void {
    this.activeTab = tab;

    this.applyFilter();
  }

  // =========================================================
  // SEARCH
  // =========================================================

  onSearchChange(): void {
    this.applyFilter();
  }

  // =========================================================
  // APPLY FILTER
  // =========================================================

  applyFilter(): void {
    let result = [...this.fraudChecks];

    // -------------------------------------------------------
    // STATUS FILTER
    // -------------------------------------------------------

    if (this.activeTab !== 'ALL') {
      result = result.filter((f) => f.fraud_status === this.activeTab);
    }

    // -------------------------------------------------------
    // SEARCH FILTER
    // -------------------------------------------------------

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();

      result = result.filter(
        (f) =>
          (f.customer_name || '').toLowerCase().includes(q) ||
          (f.beneficiary_name || '').toLowerCase().includes(q) ||
          (f.to_account_no || '').toLowerCase().includes(q) ||
          String(f.payment_id).includes(q) ||
          (f.rule_triggered || '').toLowerCase().includes(q),
      );
    }

    // -------------------------------------------------------
    // SORT BY RISK
    // -------------------------------------------------------

    result.sort((a, b) => b.risk_score - a.risk_score);

    this.filteredFraudChecks = result;
  }

  // =========================================================
  // COUNTS
  // =========================================================

  get totalCount(): number {
    return this.fraudChecks.length;
  }

  get pendingCount(): number {
    return this.fraudChecks.filter((f) => f.fraud_status === 'Pending').length;
  }

  get safeCount(): number {
    return this.fraudChecks.filter((f) => f.fraud_status === 'Safe').length;
  }

  get suspiciousCount(): number {
    return this.fraudChecks.filter((f) => f.fraud_status === 'Suspicious')
      .length;
  }

  get blockedCount(): number {
    return this.fraudChecks.filter((f) => f.fraud_status === 'Blocked').length;
  }

  // =========================================================
  // RISK LEVEL
  // =========================================================

  riskLevel(score: number): RiskLevel {
    if (score >= 61) {
      return 'high';
    }

    if (score >= 31) {
      return 'medium';
    }

    return 'low';
  }

  // =========================================================
  // RULE CHECK
  // =========================================================

  hasTriggeredRule(rule: string | null | undefined): boolean {
    return !!rule && rule !== 'NONE' && rule !== 'NORMAL_TRANSACTION';
  }

  // =========================================================
  // RULE LABEL
  // =========================================================

  formatRuleLabel(rule: string | null | undefined): string {
    if (!rule) {
      return '';
    }

    return rule
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // =========================================================
  // APPROVE MODAL
  // =========================================================

  openApproveModal(record: FraudCheck): void {
    this.selectedForApprove = record;

    this.showApproveModal = true;
  }

  closeApproveModal(): void {
    this.showApproveModal = false;

    this.selectedForApprove = null;
  }

  // =========================================================
  // CONFIRM SAFE
  // =========================================================

  confirmApprove(): void {
    const selected = this.selectedForApprove;

    if (selected?.fraud_check_id == null) {
      return;
    }

    const label =
      selected.beneficiary_name || `Payment #${selected.payment_id}`;

    this.fraudCheckService.markSafe(selected.fraud_check_id).subscribe({
      next: (updatedFraudCheck) => {
        this.updateLocalRecord(updatedFraudCheck);

        this.closeApproveModal();

        this.showToast(`Transaction to "${label}" cleared as Safe.`, 'success');
      },

      error: (error) => {
        console.error('Failed to mark transaction as Safe:', error);

        this.showToast('Failed to clear transaction.', 'error');
      },
    });
  }

  // =========================================================
  // BLOCK MODAL
  // =========================================================

  openBlockModal(record: FraudCheck): void {
    this.selectedForBlock = record;

    this.blockRemarks = '';

    this.showBlockModal = true;
  }

  closeBlockModal(): void {
    this.showBlockModal = false;

    this.selectedForBlock = null;

    this.blockRemarks = '';
  }

  // =========================================================
  // CONFIRM BLOCK
  // =========================================================

  confirmBlock(): void {
    const selected = this.selectedForBlock;

    if (selected?.fraud_check_id == null) {
      return;
    }

    const label =
      selected.beneficiary_name || `Payment #${selected.payment_id}`;

    const remarks = this.blockRemarks.trim() || undefined;

    this.fraudCheckService
      .blockTransaction(selected.fraud_check_id, remarks)
      .subscribe({
        next: (updatedFraudCheck) => {
          this.updateLocalRecord(updatedFraudCheck);

          this.closeBlockModal();

          this.showToast(
            `Transaction to "${label}" has been blocked.`,
            'warning',
          );
        },

        error: (error) => {
          console.error('Failed to block transaction:', error);

          this.showToast('Failed to block transaction.', 'error');
        },
      });
  }

  // =========================================================
  // FLAG SUSPICIOUS
  // =========================================================

  flagSuspicious(record: FraudCheck): void {
    if (record.fraud_check_id == null) {
      return;
    }

    this.fraudCheckService.flagSuspicious(record.fraud_check_id).subscribe({
      next: (updatedFraudCheck) => {
        this.updateLocalRecord(updatedFraudCheck);

        this.showToast(
          `Transaction to "${record.beneficiary_name || 'beneficiary'}" flagged as Suspicious.`,
          'warning',
        );
      },

      error: (error) => {
        console.error('Failed to flag transaction:', error);

        this.showToast('Failed to flag transaction.', 'error');
      },
    });
  }

  // =========================================================
  // UPDATE LOCAL RECORD
  // =========================================================

  private updateLocalRecord(updatedFraudCheck: FraudCheck): void {
    const index = this.fraudChecks.findIndex(
      (f) => f.fraud_check_id === updatedFraudCheck.fraud_check_id,
    );

    if (index !== -1) {
      this.fraudChecks[index] = updatedFraudCheck;
    }

    this.applyFilter();
  }

  // =========================================================
  // TOAST
  // =========================================================

  private showToast(
    msg: string,
    type: 'success' | 'warning' | 'error' = 'success',
  ): void {
    this.toastMessage = msg;

    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
