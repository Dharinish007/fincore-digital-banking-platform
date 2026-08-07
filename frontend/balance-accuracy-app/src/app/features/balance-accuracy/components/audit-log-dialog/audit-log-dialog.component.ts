import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuditLogItem } from '../../../../core/models/audit-log.model';
import { BankAccount } from '../../../../core/models/account.model';

export interface AuditLogDialogData {
  account: BankAccount;
  logs: AuditLogItem[];
}

@Component({
  selector: 'app-audit-log-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './audit-log-dialog.component.html',
  styleUrls: ['./audit-log-dialog.component.scss']
})
export class AuditLogDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AuditLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuditLogDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
