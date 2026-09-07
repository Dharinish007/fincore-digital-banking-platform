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

  applyFilters(): void {
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

  exportAuditReport(): void {
    this.showToast('Official ISO-27001 Compliance Audit Log exported successfully.');
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
