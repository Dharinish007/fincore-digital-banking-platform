import { Injectable, signal, inject } from '@angular/core';
import { StatementArchive, EmailSchedule, SecurityAuditLog } from '../models/banking.models';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryStorageService {
  private accountService = inject(AccountService);

  readonly archives = signal<StatementArchive[]>([
    {
      id: 'arch-901',
      accountId: 'acc-101',
      accountNumber: '4829104857219821',
      periodLabel: 'June 2026 Monthly Statement',
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      format: 'PDF',
      template: 'CLASSIC',
      generatedAt: '2026-07-01T08:30:00Z',
      fileSize: '412 KB',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      s3BucketPath: 's3://fincore-bank-vault-prod/statements/2026/06/acc-101-stmt.pdf',
      isPasswordProtected: true,
      downloadCount: 3
    },
    {
      id: 'arch-902',
      accountId: 'acc-101',
      accountNumber: '4829104857219821',
      periodLabel: 'FY 2025-2026 Tax Summary',
      startDate: '2025-04-01',
      endDate: '2026-03-31',
      format: 'EXCEL',
      template: 'TAX',
      generatedAt: '2026-04-05T10:15:22Z',
      fileSize: '840 KB',
      checksum: 'a8910b24c14829f001124810294719a8421049281a029381048f0291048a1290',
      s3BucketPath: 's3://fincore-bank-vault-prod/statements/tax/2025-2026-acc-101.xlsx',
      isPasswordProtected: false,
      downloadCount: 7
    },
    {
      id: 'arch-903',
      accountId: 'acc-102',
      accountNumber: '8830192485714012',
      periodLabel: 'Q1 2026 Savings Reserve Audit',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      format: 'PDF',
      template: 'EXECUTIVE',
      generatedAt: '2026-04-01T09:00:00Z',
      fileSize: '320 KB',
      checksum: 'c4ca4238a0b923820dcc509a6f75849b2910247192801948194018291029481a',
      s3BucketPath: 's3://fincore-bank-vault-prod/statements/2026/q1/acc-102-savings.pdf',
      isPasswordProtected: true,
      downloadCount: 1
    }
  ]);

  readonly emailSchedules = signal<EmailSchedule[]>([
    {
      id: 'sch-1',
      accountId: 'acc-101',
      recipientEmail: 'alexander.sterling@fincore.com',
      frequency: 'MONTHLY',
      format: 'PDF',
      template: 'CLASSIC',
      isEncrypted: true,
      passwordHint: 'Date of Birth (YYYYMMDD)',
      lastSent: '2026-07-01 08:30 AM',
      nextScheduledDate: '2026-08-01 08:00 AM',
      status: 'ACTIVE'
    }
  ]);

  readonly auditLogs = signal<SecurityAuditLog[]>([
    {
      id: 'log-101',
      timestamp: new Date('2026-07-29T22:20:00').toLocaleString(),
      eventType: 'AUTH_CHECK',
      accountNumberMasked: '•••• •••• •••• 9821',
      userIP: '192.168.1.104',
      details: 'User authorization verified for Platinum Premier Checking. Account ownership: VERIFIED_PRIMARY',
      status: 'SUCCESS'
    },
    {
      id: 'log-102',
      timestamp: new Date('2026-07-29T22:22:15').toLocaleString(),
      eventType: 'DATA_MASK_TOGGLE',
      accountNumberMasked: '•••• •••• •••• 9821',
      userIP: '192.168.1.104',
      details: 'Data Masking (Privacy Mode) enabled by user.',
      status: 'SUCCESS'
    }
  ]);

  readonly toastMessage = signal<{ title: string; body: string; type: 'success' | 'info' | 'warning' } | null>(null);

  showToast(title: string, body: string, type: 'success' | 'info' | 'warning' = 'success') {
    this.toastMessage.set({ title, body, type });
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4500);
  }

  saveToArchive(periodLabel: string, startDate: string, endDate: string, format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON', isProtected: boolean) {
    const acc = this.accountService.activeAccount();
    const newArch: StatementArchive = {
      id: 'arch-' + Date.now(),
      accountId: acc.id,
      accountNumber: acc.accountNumber,
      periodLabel,
      startDate,
      endDate,
      format,
      template: 'CLASSIC',
      generatedAt: new Date().toISOString(),
      fileSize: Math.floor(Math.random() * 400 + 200) + ' KB',
      checksum: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      s3BucketPath: `s3://apex-bank-vault-prod/statements/${startDate.slice(0, 4)}/${acc.id}-statement.${format.toLowerCase()}`,
      isPasswordProtected: isProtected,
      downloadCount: 1
    };

    this.archives.update(list => [newArch, ...list]);
    this.addAuditLog('STATEMENT_GENERATE', `Generated & Archived ${format} statement for ${periodLabel}`);
    this.showToast('Archived to Cloud Vault', `Statement for ${periodLabel} successfully encrypted & stored in S3.`);
  }

  deleteArchive(id: string) {
    this.archives.update(list => list.filter(a => a.id !== id));
    this.showToast('Archive Removed', 'Selected statement record deleted from cloud vault.', 'info');
  }

  dispatchEmailStatement(recipient: string, isEncrypted: boolean, passwordHint?: string) {
    const acc = this.accountService.activeAccount();
    this.addAuditLog('STATEMENT_EMAIL', `Dispatched encrypted PDF statement to ${recipient}`);
    this.showToast(
      'Statement Sent via Email',
      `Secure PDF statement dispatched to ${recipient}.${isEncrypted ? ' Password protection active.' : ''}`,
      'success'
    );
  }

  addAuditLog(eventType: SecurityAuditLog['eventType'], details: string, status: 'SUCCESS' | 'WARNING' | 'DENIED' = 'SUCCESS') {
    const acc = this.accountService.activeAccount();
    const masked = this.accountService.maskAccountNumber(acc.accountNumber, true);
    const newLog: SecurityAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      eventType,
      accountNumberMasked: masked,
      userIP: '192.168.1.104',
      details,
      status
    };
    this.auditLogs.update(logs => [newLog, ...logs]);
  }
}
