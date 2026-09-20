import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatisticCardComponent } from '../../../../shared/components/statistic-card/statistic-card.component';
import { CardContainerComponent } from '../../../../shared/components/card-container/card-container.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { LoanStatusBadgeComponent } from '../../components/loan-status-badge/loan-status-badge.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../../../core/services/auth.service';
import { 
  LoanApplication, 
  Loan, 
  CreditAssessment, 
  LoanStatistics, 
  ApplicationStatus, 
  LoanStatus, 
  AssessmentDecision, 
  RiskLevel 
} from '../../models/loan.models';

@Component({
  selector: 'app-loan-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeaderComponent,
    StatisticCardComponent,
    CardContainerComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    LoanStatusBadgeComponent
  ],
  templateUrl: './loan-review.component.html',
  styleUrl: './loan-review.component.scss'
})
export class LoanReviewComponent implements OnInit {
  private loanService = inject(LoanService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  isLoading = signal<boolean>(true);
  isActionInProgress = signal<boolean>(false);

  applications = signal<LoanApplication[]>([]);
  loans = signal<Loan[]>([]);
  statistics = signal<LoanStatistics | null>(null);

  selectedStatus = signal<string>('ALL');

  // Modals state
  activeAssessmentApp = signal<LoanApplication | null>(null);
  activeAssessment = signal<CreditAssessment | null>(null);
  showAssessmentModal = signal<boolean>(false);

  showApproveModal = signal<boolean>(false);
  approveTargetApp = signal<LoanApplication | null>(null);
  officerNotes = '';

  showRejectModal = signal<boolean>(false);
  rejectTargetApp = signal<LoanApplication | null>(null);
  rejectionReason = '';

  showDisburseModal = signal<boolean>(false);
  disburseTargetLoan = signal<Loan | null>(null);

  // Filtered applications
  filteredApplications = computed(() => {
    const status = this.selectedStatus();
    const list = this.applications();
    if (status === 'ALL') return list;
    return list.filter(a => a.status === status);
  });

  // Pending disbursement loans
  pendingDisbursementLoans = computed(() => {
    return this.loans().filter(l => l.status === LoanStatus.PENDING_DISBURSEMENT);
  });

  // Table columns
  appColumns: string[] = ['applicationNumber', 'customerId', 'accountNumber', 'productName', 'requestedAmount', 'tenure', 'status', 'createdAt', 'actions'];
  loanColumns: string[] = ['loanNumber', 'customerId', 'accountNumber', 'productName', 'principalAmount', 'emiAmount', 'status', 'actions'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    // 1. Fetch statistics
    this.loanService.getStatistics().subscribe({
      next: (stats) => this.statistics.set(stats),
      error: () => console.warn('Statistics unavailable')
    });

    // 2. Fetch all applications (Employee/Admin perspective)
    this.loanService.getAllApplications(undefined, undefined, 0, 100).subscribe({
      next: (apps) => {
        this.applications.set(apps || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load applications:', err);
        this.notificationService.error('Failed to load loan applications. Ensure you have authorized permissions.');
        this.isLoading.set(false);
      }
    });

    // 3. Fetch all loans
    this.loanService.getAllLoans(undefined, undefined, 0, 100).subscribe({
      next: (loans) => this.loans.set(loans || []),
      error: (err) => console.warn('Could not load loans list:', err)
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus.set(status);
  }

  // --- Assessment Actions ---
  onRunAssessment(app: LoanApplication): void {
    this.isActionInProgress.set(true);
    this.notificationService.info(`Calculating deterministic credit score for ${app.applicationNumber}...`);

    this.loanService.assessApplication(app.id).subscribe({
      next: (assessment) => {
        this.isActionInProgress.set(false);
        this.activeAssessmentApp.set(app);
        this.activeAssessment.set(assessment);
        this.showAssessmentModal.set(true);
        this.notificationService.success(`Credit score calculated: ${assessment.creditScore} (${assessment.decision})`);
        this.loadData(); // Refresh application status to CREDIT_ASSESSED
      },
      error: (err) => {
        this.isActionInProgress.set(false);
        const msg = err?.error?.message || 'Failed to run credit assessment';
        this.notificationService.error(msg);
      }
    });
  }

  onViewAssessment(app: LoanApplication): void {
    if (app.creditAssessment) {
      this.activeAssessmentApp.set(app);
      this.activeAssessment.set(app.creditAssessment);
      this.showAssessmentModal.set(true);
      return;
    }

    this.isActionInProgress.set(true);
    this.loanService.getCreditAssessment(app.id).subscribe({
      next: (ca) => {
        this.isActionInProgress.set(false);
        this.activeAssessmentApp.set(app);
        this.activeAssessment.set(ca);
        this.showAssessmentModal.set(true);
      },
      error: () => {
        this.isActionInProgress.set(false);
        // If not assessed yet, offer to run assessment
        this.onRunAssessment(app);
      }
    });
  }

  closeAssessmentModal(): void {
    this.showAssessmentModal.set(false);
    this.activeAssessment.set(null);
    this.activeAssessmentApp.set(null);
  }

  // --- Approval Actions ---
  openApproveDialog(app: LoanApplication): void {
    this.approveTargetApp.set(app);
    this.officerNotes = '';
    this.showApproveModal.set(true);
  }

  closeApproveModal(): void {
    this.showApproveModal.set(false);
    this.approveTargetApp.set(null);
  }

  confirmApprove(): void {
    const app = this.approveTargetApp();
    if (!app) return;

    this.isActionInProgress.set(true);
    this.loanService.approveApplication(app.id, this.officerNotes).subscribe({
      next: (generatedLoan) => {
        this.isActionInProgress.set(false);
        this.closeApproveModal();
        this.closeAssessmentModal();
        this.notificationService.success(`Application ${app.applicationNumber} approved! Generated Loan: ${generatedLoan.loanNumber}`);
        this.loadData();
      },
      error: (err) => {
        this.isActionInProgress.set(false);
        const msg = err?.error?.message || 'Failed to approve application. Ensure credit assessment is complete.';
        this.notificationService.error(msg);
      }
    });
  }

  // --- Rejection Actions ---
  openRejectDialog(app: LoanApplication): void {
    this.rejectTargetApp.set(app);
    this.rejectionReason = '';
    this.showRejectModal.set(true);
  }

  closeRejectModal(): void {
    this.showRejectModal.set(false);
    this.rejectTargetApp.set(null);
  }

  confirmReject(): void {
    const app = this.rejectTargetApp();
    if (!app) return;

    this.isActionInProgress.set(true);
    this.loanService.rejectApplication(app.id, this.rejectionReason).subscribe({
      next: () => {
        this.isActionInProgress.set(false);
        this.closeRejectModal();
        this.closeAssessmentModal();
        this.notificationService.warning(`Application ${app.applicationNumber} rejected.`);
        this.loadData();
      },
      error: (err) => {
        this.isActionInProgress.set(false);
        const msg = err?.error?.message || 'Failed to reject application.';
        this.notificationService.error(msg);
      }
    });
  }

  // --- Disbursement Actions ---
  openDisburseDialog(loan: Loan): void {
    this.disburseTargetLoan.set(loan);
    this.showDisburseModal.set(true);
  }

  closeDisburseModal(): void {
    this.showDisburseModal.set(false);
    this.disburseTargetLoan.set(null);
  }

  confirmDisburse(): void {
    const loan = this.disburseTargetLoan();
    if (!loan) return;

    this.isActionInProgress.set(true);
    this.loanService.disburseLoan(loan.id).subscribe({
      next: (disbursedLoan) => {
        this.isActionInProgress.set(false);
        this.closeDisburseModal();
        this.notificationService.success(`Funds successfully disbursed for Loan ${disbursedLoan.loanNumber} to Account ${disbursedLoan.accountNumber}!`);
        this.loadData();
      },
      error: (err) => {
        this.isActionInProgress.set(false);
        const msg = err?.error?.message || 'Disbursement failed. Verify account status.';
        this.notificationService.error(msg);
      }
    });
  }

  viewDetails(app: LoanApplication): void {
    this.router.navigate(['/loan/application', app.id]);
  }

  viewLoanDetails(loan: Loan): void {
    this.router.navigate(['/loan', loan.id]);
  }
}
