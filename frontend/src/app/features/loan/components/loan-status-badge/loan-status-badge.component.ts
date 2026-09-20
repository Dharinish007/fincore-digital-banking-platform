import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent, BadgeStatus } from '../../../../shared/components/status-badge/status-badge.component';
import { ApplicationStatus, LoanStatus } from '../../models/loan.models';

@Component({
  selector: 'app-loan-status-badge',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <app-status-badge [label]="formattedLabel" [status]="badgeStatus"></app-status-badge>
  `
})
export class LoanStatusBadgeComponent {
  @Input({ required: true }) status!: ApplicationStatus | LoanStatus | string;

  get formattedLabel(): string {
    if (!this.status) return 'Unknown';
    return this.status.replace(/_/g, ' ');
  }

  get badgeStatus(): BadgeStatus {
    const s = (this.status || '').toUpperCase();
    switch (s) {
      case 'ACTIVE':
      case 'APPROVED':
        return 'success';
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
      case 'CREDIT_ASSESSED':
      case 'PENDING_DISBURSEMENT':
      case 'DRAFT':
        return 'warning';
      case 'REJECTED':
      case 'DEFAULTED':
      case 'CANCELLED':
        return 'danger';
      case 'PAID_OFF':
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
    }
  }
}
