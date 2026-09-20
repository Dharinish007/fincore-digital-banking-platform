import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BankAccount } from '../../../../core/models/account.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-detail-drawer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, StatusBadgeComponent],
  templateUrl: './detail-drawer.component.html',
  styleUrls: ['./detail-drawer.component.scss']
})
export class DetailDrawerComponent {
  @Input() account: BankAccount | null = null;
  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();
  @Output() verifyClick = new EventEmitter<BankAccount>();
  @Output() auditClick = new EventEmitter<BankAccount>();

  onClose(): void {
    this.close.emit();
  }

  onVerify(): void {
    if (this.account) {
      this.verifyClick.emit(this.account);
    }
  }

  onAudit(): void {
    if (this.account) {
      this.auditClick.emit(this.account);
    }
  }
}
