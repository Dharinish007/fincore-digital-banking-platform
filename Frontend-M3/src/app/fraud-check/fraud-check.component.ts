import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
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
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './fraud-check.component.html',
  styleUrls: ['./fraud-check.component.scss'],
})
export class FraudCheckComponent implements OnInit {
  sidebarCollapsed = false;

  fraudChecks: FraudCheck[] = [];
  filteredFraudChecks: FraudCheck[] = [];

  activeTab: FraudTab = 'ALL';
  searchQuery = '';

  // Approve (Mark Safe) Modal State
  selectedForApprove: FraudCheck | null = null;
  showApproveModal = false;

  // Block Modal State
  selectedForBlock: FraudCheck | null = null;
  showBlockModal = false;
  blockRemarks = '';

  // Toast Notification
  toastMessage: string | null = null;
  toastType: 'success' | 'warning' | 'error' = 'success';

  constructor(private fraudCheckService: FraudCheckService) {}

  ngOnInit(): void {
    this.fraudCheckService.getFraudChecks().subscribe((data) => {
      this.fraudChecks = data;
      this.applyFilter();
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setTab(tab: FraudTab): void {
    this.activeTab = tab;
    this.applyFilter();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.fraudChecks];

    // Status Tab Filter
    if (this.activeTab !== 'ALL') {
      result = result.filter((f) => f.fraud_status === this.activeTab);
    }

    // Search Query Filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          (f.customer_name || '').toLowerCase().includes(q) ||
          (f.beneficiary_name || '').toLowerCase().includes(q) ||
          (f.to_account_no || '').toLowerCase().includes(q) ||
          String(f.payment_id).includes(q) ||
          (f.rule_triggered || '').toLowerCase().includes(q)
      );
    }

    // Highest risk first for pending items so analysts see urgent cases up top
    result.sort((a, b) => b.risk_score - a.risk_score);

    this.filteredFraudChecks = result;
  }

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
    return this.fraudChecks.filter((f) => f.fraud_status === 'Suspicious').length;
  }

  get blockedCount(): number {
    return this.fraudChecks.filter((f) => f.fraud_status === 'Blocked').length;
  }

  riskLevel(score: number): RiskLevel {
    if (score >= 61) return 'high';
    if (score >= 31) return 'medium';
    return 'low';
  }

  // Approve (Mark Safe) Handlers
  openApproveModal(record: FraudCheck): void {
    this.selectedForApprove = record;
    this.showApproveModal = true;
  }

  closeApproveModal(): void {
    this.showApproveModal = false;
    this.selectedForApprove = null;
  }

  confirmApprove(): void {
    if (this.selectedForApprove?.fraud_check_id != null) {
      const label = this.selectedForApprove.beneficiary_name || `Payment #${this.selectedForApprove.payment_id}`;
      this.fraudCheckService.markSafe(this.selectedForApprove.fraud_check_id);
      this.closeApproveModal();
      this.showToast(`Transaction to "${label}" cleared as Safe. Execution will proceed.`, 'success');
    }
  }

  // Block Handlers
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

  confirmBlock(): void {
    if (this.selectedForBlock?.fraud_check_id != null) {
      const label = this.selectedForBlock.beneficiary_name || `Payment #${this.selectedForBlock.payment_id}`;
      this.fraudCheckService.blockTransaction(
        this.selectedForBlock.fraud_check_id,
        this.blockRemarks.trim() || undefined
      );
      this.closeBlockModal();
      this.showToast(`Transaction to "${label}" has been blocked. Payment stopped.`, 'warning');
    }
  }

  // Quick inline action: flag a pending item for further review without a modal
  flagSuspicious(record: FraudCheck): void {
    if (record.fraud_check_id == null) return;
    this.fraudCheckService.flagSuspicious(record.fraud_check_id);
    this.showToast(
      `Transaction to "${record.beneficiary_name || 'beneficiary'}" flagged as Suspicious for further review.`,
      'warning'
    );
  }

  private showToast(msg: string, type: 'success' | 'warning' | 'error' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
