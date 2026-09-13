import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface AuditLogItem {
  id?: number;
  userId?: number;
  username?: string;
  createdAt: string;
  actor?: string;
  action: string;
  module?: string;
  status?: string;
  entityType: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  metadata?: string;
}

interface AuditLogResponse {
  items?: AuditLogItem[];
  total?: number;
  page?: number;
  size?: number;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.css'
})
export class AuditComponent implements OnInit {
  private readonly api = inject(ApiService);
  auditLogs: AuditLogItem[] = [];

  searchTerm = '';
  moduleFilter = '';
  statusFilter = '';
  fromDate = '';
  toDate = '';
  page = 0;
  pageSize = 25;
  totalLogs = 0;
  selectedLog: AuditLogItem | null = null;
  toastMessage: string | null = null;
  sortField: keyof AuditLogItem = 'createdAt';
  sortAscending = false;

  readonly availableModules = [
    { value: '', label: 'All Modules (Platform-Wide)' },
    { value: 'RISK', label: 'AI Risk Assessment (M4)' },
    { value: 'LIVENESS', label: 'Biometric Liveness Verification (M4)' },
    { value: 'SECURITY', label: 'Customer Security & Passcode (M4)' },
    { value: 'OPERATIONS', label: 'Core Banking Operations (M1)' },
    { value: 'STATEMENT', label: 'Statement Generation Engine (M1)' },
    { value: 'LOAN', label: 'Loan Management, EMI & Collections (M2)' },
    { value: 'SETTLEMENT', label: 'Interbank Settlement & Clearing (M3)' },
    { value: 'FRAUD', label: 'Fraud Detection & Anomalies (M3)' },
    { value: 'NOTIFICATION', label: 'Notification Service (M3)' },
    { value: 'AUTH', label: 'Authentication & Session Gate (M1-M4)' }
  ];

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    const params = new URLSearchParams({
      search: this.searchTerm,
      module: this.moduleFilter,
      status: this.statusFilter,
      page: String(this.page),
      size: String(this.pageSize)
    });
    if (this.fromDate) params.set('from', this.fromDate);
    if (this.toDate) params.set('to', this.toDate);
    this.api.get<AuditLogResponse>(`/api/audit-logs?${params.toString()}`).subscribe({
      next: response => {
        this.auditLogs = response.items ?? [];
        this.totalLogs = response.total ?? 0;
      },
      error: () => this.showToast('Unable to load audit logs from backend.')
    });
  }

  get filteredLogs(): AuditLogItem[] {
    return [...this.auditLogs].sort((first, second) => {
      const left = String(first[this.sortField] ?? '');
      const right = String(second[this.sortField] ?? '');
      return this.sortAscending ? left.localeCompare(right) : right.localeCompare(left);
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalLogs / this.pageSize));
  }

  get riskAndLivenessCount(): number {
    return this.auditLogs.filter(l => {
      const m = (l.module || l.entityType || '').toUpperCase();
      return m.includes('RISK') || m.includes('LIVENESS') || m.includes('SECURITY');
    }).length;
  }

  get operationsCount(): number {
    return this.auditLogs.filter(l => {
      const m = (l.module || l.entityType || '').toUpperCase();
      return m.includes('OPERATION') || m.includes('ACCOUNT') || m.includes('STATEMENT');
    }).length;
  }

  get loanCount(): number {
    return this.auditLogs.filter(l => {
      const m = (l.module || l.entityType || '').toUpperCase();
      return m.includes('LOAN') || m.includes('EMI') || m.includes('COLLECTION') || m.includes('DISBURSEMENT');
    }).length;
  }

  get settlementAndFraudCount(): number {
    return this.auditLogs.filter(l => {
      const m = (l.module || l.entityType || '').toUpperCase();
      return m.includes('SETTLEMENT') || m.includes('FRAUD') || m.includes('NOTIFICATION');
    }).length;
  }

  setQuickModuleFilter(mod: string): void {
    this.moduleFilter = mod;
    this.applyFilters();
  }

  applyFilters(): void {
    this.page = 0;
    this.loadAuditLogs();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.moduleFilter = '';
    this.statusFilter = '';
    this.fromDate = '';
    this.toDate = '';
    this.page = 0;
    this.loadAuditLogs();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page += 1;
      this.loadAuditLogs();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page -= 1;
      this.loadAuditLogs();
    }
  }

  sortBy(field: keyof AuditLogItem): void {
    this.sortAscending = this.sortField === field ? !this.sortAscending : true;
    this.sortField = field;
  }

  getModuleBadgeClass(item: AuditLogItem): string {
    const mod = (item.module || item.entityType || '').toUpperCase();
    if (mod.includes('RISK')) return 'badge-risk';
    if (mod.includes('LIVENESS')) return 'badge-liveness';
    if (mod.includes('SECURITY') || mod.includes('PASSCODE')) return 'badge-security';
    if (mod.includes('OPERATION') || mod.includes('ACCOUNT')) return 'badge-operations';
    if (mod.includes('STATEMENT')) return 'badge-statement';
    if (mod.includes('LOAN') || mod.includes('EMI')) return 'badge-loan';
    if (mod.includes('SETTLEMENT')) return 'badge-settlement';
    if (mod.includes('FRAUD')) return 'badge-fraud';
    if (mod.includes('NOTIFICATION')) return 'badge-notification';
    if (mod.includes('AUTH')) return 'badge-auth';
    return 'badge-general';
  }

  exportAuditReport(): void {
    this.showToast('Official ISO-27001 Cross-Module Banking Audit Report exported successfully.');
  }

  inspectLog(item: AuditLogItem): void {
    this.selectedLog = item;
  }

  closeModal(): void {
    this.selectedLog = null;
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 4500);
  }
}
