import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditFilter, AuditLog } from '../../models/audit.model';

@Component({
  selector: 'app-audit-logging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logging.component.html',
  styleUrls: ['./audit-logging.component.css']
})
export class AuditLoggingComponent implements OnInit {
  // Master audit dataset
  allLogs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];

  // Filter state
  filter: AuditFilter = {
    searchQuery: '',
    user: 'All',
    module: 'All',
    action: 'All',
    status: 'All',
    fromDate: '',
    toDate: ''
  };

  // Pagination state
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Selected item detail modal
  selectedLog: AuditLog | null = null;
  showDetailModal: boolean = false;

  // Filter options
  modules: string[] = ['All', 'AUTH', 'RISK', 'LIVENESS', 'COLLECTION', 'PAYMENT', 'ACCOUNTS'];
  statuses: string[] = ['All', 'SUCCESS', 'FAILED'];
  users: string[] = ['All', 'Ramya', 'Admin', 'Kiran', 'SecurityOfficer'];
  actions: string[] = ['All', 'LOGIN', 'RISK_ASSESS', 'LIVENESS_CHECK', 'PAYMENT', 'ACCOUNT_FREEZE', 'KYC_VERIFY'];

  ngOnInit(): void {
    this.loadInitialLogs();
    this.applyFilters();
  }

  loadInitialLogs(): void {
    this.allLogs = [
      {
        auditId: 'AUD-9001',
        userId: 'USR101',
        userName: 'Ramya',
        action: 'LOGIN',
        module: 'AUTH',
        status: 'SUCCESS',
        description: 'User Ramya logged into teller workstation successfully.',
        timestamp: '02/09/26 10:14:22'
      },
      {
        auditId: 'AUD-9002',
        userId: 'USR999',
        userName: 'Admin',
        action: 'RISK_ASSESS',
        module: 'RISK',
        status: 'SUCCESS',
        description: 'Risk assessment performed for customer CUS1001 transaction TXN5001. Risk score: 25 (LOW).',
        timestamp: '02/09/26 10:30:15'
      },
      {
        auditId: 'AUD-9003',
        userId: 'USR101',
        userName: 'Ramya',
        action: 'LIVENESS_CHECK',
        module: 'LIVENESS',
        status: 'SUCCESS',
        description: 'Facial liveness verification passed for customer CUS1001 with 96% confidence score.',
        timestamp: '02/09/26 11:05:40'
      },
      {
        auditId: 'AUD-9004',
        userId: 'USR999',
        userName: 'Admin',
        action: 'PAYMENT',
        module: 'COLLECTION',
        status: 'FAILED',
        description: 'Loan installment collection payment failed due to insufficient funds in customer source account.',
        timestamp: '02/09/26 11:42:08'
      },
      {
        auditId: 'AUD-9005',
        userId: 'USR102',
        userName: 'Kiran',
        action: 'ACCOUNT_FREEZE',
        module: 'ACCOUNTS',
        status: 'SUCCESS',
        description: 'Account AC7721 frozen temporarily due to suspicious withdrawal activity flagged by Risk Engine.',
        timestamp: '02/09/26 12:15:33'
      },
      {
        auditId: 'AUD-9006',
        userId: 'USR105',
        userName: 'SecurityOfficer',
        action: 'KYC_VERIFY',
        module: 'LIVENESS',
        status: 'SUCCESS',
        description: 'Manual biometric validation confirmed for high-risk customer profile update.',
        timestamp: '02/09/26 13:00:10'
      },
      {
        auditId: 'AUD-9007',
        userId: 'USR101',
        userName: 'Ramya',
        action: 'RISK_ASSESS',
        module: 'RISK',
        status: 'FAILED',
        description: 'High risk transaction TXN5099 flagged and rejected automatically by rule matrix.',
        timestamp: '02/09/26 14:22:50'
      }
    ];
  }

  applyFilters(): void {
    let result = [...this.allLogs];

    // Search text filter
    if (this.filter.searchQuery.trim()) {
      const q = this.filter.searchQuery.toLowerCase();
      result = result.filter(item =>
        item.userName.toLowerCase().includes(q) ||
        item.action.toLowerCase().includes(q) ||
        item.module.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.auditId.toLowerCase().includes(q)
      );
    }

    // Dropdown filters
    if (this.filter.user !== 'All') {
      result = result.filter(item => item.userName === this.filter.user);
    }

    if (this.filter.module !== 'All') {
      result = result.filter(item => item.module === this.filter.module);
    }

    if (this.filter.action !== 'All') {
      result = result.filter(item => item.action === this.filter.action);
    }

    if (this.filter.status !== 'All') {
      result = result.filter(item => item.status === this.filter.status);
    }

    this.filteredLogs = result;
    this.totalPages = Math.ceil(this.filteredLogs.length / this.pageSize) || 1;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.filter = {
      searchQuery: '',
      user: 'All',
      module: 'All',
      action: 'All',
      status: 'All',
      fromDate: '',
      toDate: ''
    };
    this.applyFilters();
  }

  get paginatedLogs(): AuditLog[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLogs.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewDetails(log: AuditLog): void {
    this.selectedLog = log;
    this.showDetailModal = true;
  }

  closeDetails(): void {
    this.showDetailModal = false;
    this.selectedLog = null;
  }
}
