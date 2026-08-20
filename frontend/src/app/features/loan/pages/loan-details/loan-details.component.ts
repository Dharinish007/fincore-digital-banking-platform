import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CardContainerComponent } from '../../../../shared/components/card-container/card-container.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoanStatusBadgeComponent } from '../../components/loan-status-badge/loan-status-badge.component';
import { ApplicationTimelineComponent } from '../../components/application-timeline/application-timeline.component';
import { RepaymentScheduleTableComponent } from '../../components/repayment-schedule-table/repayment-schedule-table.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../../core/models/auth.models';
import { Loan, LoanApplication, RepaymentSchedule, ApplicationStatus, LoanStatus } from '../../models/loan.models';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    CardContainerComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    LoanStatusBadgeComponent,
    ApplicationTimelineComponent,
    RepaymentScheduleTableComponent
  ],
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.scss'
})
export class LoanDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loanService = inject(LoanService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  isLoading = signal<boolean>(true);
  isActionInProgress = signal<boolean>(false);
  hasError = signal<boolean>(false);
  isApplicationView = signal<boolean>(false);

  loan = signal<Loan | null>(null);
  application = signal<LoanApplication | null>(null);
  repaymentSchedule = signal<RepaymentSchedule | null>(null);

  // Operational Modals
  showApproveModal = signal<boolean>(false);
  officerNotes = '';

  showRejectModal = signal<boolean>(false);
  rejectionReason = '';

  showDisburseModal = signal<boolean>(false);

  get isStaff(): boolean {
    const role = this.authService.getCurrentRole();
    return role === Role.EMPLOYEE;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.hasError.set(true);
        this.isLoading.set(false);
        return;
      }

      const currentUrl = this.router.url;
      if (currentUrl.includes('/application/')) {
        this.isApplicationView.set(true);
        this.loadApplicationDetails(id);
      } else {
        this.loadLoanDetails(id);
      }
    });
  }

  private loadLoanDetails(id: string | number): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.loanService.getLoanById(id).subscribe({
      next: (loanData) => {
        this.loan.set(loanData);
        this.isApplicationView.set(false);
        this.loadSchedule(id);
        this.isLoading.set(false);
      },
      error: (loanErr) => {
        console.warn('Loan not found by ID, attempting application fallback lookup:', loanErr);
        // Fallback: check if the ID corresponds to an application
        this.loadApplicationDetails(id);
      }
    });
  }

  private loadSchedule(loanId: string | number): void {
    this.loanService.getRepaymentSchedule(loanId).subscribe({
      next: (sched) => this.repaymentSchedule.set(sched),
      error: (err) => console.warn('Could not load repayment schedule:', err)
    });
  }

  private loadApplicationDetails(id: string | number): void {
    this.isLoading.set(true);
    this.loanService.getApplicationById(id).subscribe({
      next: (appData) => {
        this.application.set(appData);
        this.isApplicationView.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load application:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  // --- Operational Underwriting Actions ---
  onRunAssessment(): void {
    const app = this.application();
    if (!app) return;

    this.isActionInProgress.set(true);
    this.loanService.assessApplication(app.id).subscribe({
      next: (assessment) => {
        this.isActionInProgress.set(false);
        this.application.update(a => a ? { ...a, status: ApplicationStatus.CREDIT_ASSESSED, creditAssessment: assessment } : null);
        this.notificationService.success(`Credit assessment completed: Score ${assessment.creditScore} (${assessment.decision})`);
      },
      error: (err) => {
        this.isActionInProgress.set(false);
        this.notificationService.error(err?.error?.message || 'Failed to calculate credit score');
      }
    });
  }

  openApproveDialog(): void {
    this.officerNotes = '';
    this.showApproveModal.set(true);
  }

  closeApproveModal(): void {
    this.showApproveModal.set(false);
  }

  confirmApprove(): void {
    const app = this.application();
    if (!app) return;

    this.isActionInProgress.set(true);
    this.loanService.approveApplication(app.id, this.officerNotes).subscribe({
      next: (loan) => {
        this.isActionInProgress.set(false);
        this.closeApproveModal();
        this.notificationService.success(`Application approved! Generated Loan: ${loan.loanNumber}`);
        this.loadApplicationDetails(app.id);
      },
      error: (err) => {
        this.isActionInProgress.set(false);
        this.notificationService.error(err?.error?.message || 'Approval failed');
      }
    });
  }

  openRejectDialog(): void {
    this.rejectionReason = '';
    this.showRejectModal.set(true);
  }

  closeRejectModal(): void {
    this.showRejectModal.set(false);
  }

  confirmReject(): void {
    const app = this.application();
    if (!app) return;

    this.isActionInProgress.set(true);
    this.loanService.rejectApplication(app.id, this.rejectionReason).subscribe({
      next: () => {
        this.isActionInProgress.set(false);
        this.closeRejectModal();
        this.notificationService.warning(`Application rejected.`);
        this.loadApplicationDetails(app.id);
      },
      error: (err) => {
        this.isActionInProgress.set(false);
        this.notificationService.error(err?.error?.message || 'Rejection failed');
      }
    });
  }

  openDisburseDialog(): void {
    this.showDisburseModal.set(true);
  }

  closeDisburseModal(): void {
    this.showDisburseModal.set(false);
  }

  confirmDisburse(): void {
    const loan = this.loan();
    if (!loan) return;

    this.isActionInProgress.set(true);
    this.loanService.disburseLoan(loan.id).subscribe({
      next: (disbursedLoan) => {
        this.isActionInProgress.set(false);
        this.closeDisburseModal();
        this.notificationService.success(`Loan ${disbursedLoan.loanNumber} disbursed to Account ${disbursedLoan.accountNumber}!`);
        this.loadLoanDetails(loan.id);
      },
      error: (err) => {
        this.isActionInProgress.set(false);
        this.notificationService.error(err?.error?.message || 'Disbursement failed');
      }
    });
  }

  backToDashboard(): void {
    if (this.isStaff) {
      this.router.navigate(['/loan/review']);
    } else {
      this.router.navigate(['/loan']);
    }
  }
}
