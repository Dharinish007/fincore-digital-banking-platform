import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AuditLogItem {
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  ip: string;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.css'
})
export class AuditComponent {
  auditLogs: AuditLogItem[] = [
    { timestamp: '2026-08-25 14:32:10', user: 'Bank Teller (ID: 9021)', action: 'LOAN_ORIGINATION_APPROVED', entity: 'Loan: HL-2024-1247 (₹24,00,000)', ip: '10.240.12.84' },
    { timestamp: '2026-08-25 14:32:11', user: 'SYSTEM (Kafka Worker)', action: 'SAGA_EVENT_DISPATCH', entity: 'Topic: loan.events.disbursed', ip: '10.240.0.12' },
    { timestamp: '2026-08-25 14:35:00', user: 'Bank Teller (ID: 9021)', action: 'EMI_SCHEDULE_GENERATED', entity: 'Tenure: 240 months (EMI ₹18,470)', ip: '10.240.12.84' },
    { timestamp: '2026-08-25 15:00:22', user: 'Compliance Officer (ID: 4011)', action: 'FRAUD_ACCOUNT_FREEZE', entity: 'Customer: John Smith (Score 88)', ip: '10.240.8.19' },
    { timestamp: '2026-08-25 15:30:10', user: 'Settlement Engine', action: 'INTERBANK_BATCH_CLEARED', entity: 'Batch: SETTLE-2026-0820 (₹14.2 Cr)', ip: '10.240.2.100' }
  ];

  searchTerm = '';
  selectedLog: AuditLogItem | null = null;
  toastMessage: string | null = null;

  get filteredLogs(): AuditLogItem[] {
    return this.auditLogs.filter(l =>
      l.user.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      l.entity.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
