import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatisticCardComponent } from '../../../../shared/components/statistic-card/statistic-card.component';
import { CardContainerComponent } from '../../../../shared/components/card-container/card-container.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { LoanStatusBadgeComponent } from '../../components/loan-status-badge/loan-status-badge.component';
import { EmiCalculatorWidgetComponent } from '../../components/emi-calculator-widget/emi-calculator-widget.component';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Loan, LoanApplication, LoanStatistics, LoanStatus, ApplicationStatus } from '../../models/loan.models';

@Component({
  selector: 'app-loan-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    PageHeaderComponent,
    StatisticCardComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    LoanStatusBadgeComponent,
    EmiCalculatorWidgetComponent
  ],
  templateUrl: './loan-dashboard.component.html',
  styleUrl: './loan-dashboard.component.scss'
})
export class LoanDashboardComponent implements OnInit {
  private loanService = inject(LoanService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);

  loans = signal<Loan[]>([]);
  applications = signal<LoanApplication[]>([]);
  statistics = signal<LoanStatistics | null>(null);

  // Computed metrics from real backend data
  activeLoansCount = computed(() => {
    if (this.statistics()?.activeLoans !== undefined) {
      return this.statistics()!.activeLoans;
    }
    return this.loans().filter(l => l.status === LoanStatus.ACTIVE).length;
  });

  totalOutstanding = computed(() => {
    if (this.statistics()?.totalActiveOutstandingAmount !== undefined) {
      return this.statistics()!.totalActiveOutstandingAmount;
    }
    return this.loans()
      .filter(l => l.status === LoanStatus.ACTIVE)
      .reduce((sum, l) => sum + (l.outstandingAmount || 0), 0);
  });

  totalDisbursed = computed(() => {
    if (this.statistics()?.totalDisbursedAmount !== undefined) {
      return this.statistics()!.totalDisbursedAmount;
    }
    return this.loans()
      .filter(l => l.status === LoanStatus.ACTIVE || l.status === LoanStatus.PAID_OFF)
      .reduce((sum, l) => sum + (l.principalAmount || 0), 0);
  });

  pendingApplicationsCount = computed(() => {
    if (this.statistics()?.pendingApplications !== undefined) {
      return this.statistics()!.pendingApplications;
    }
    return this.applications().filter(a =>
      a.status === ApplicationStatus.SUBMITTED ||
      a.status === ApplicationStatus.UNDER_REVIEW ||
      a.status === ApplicationStatus.CREDIT_ASSESSED ||
      a.status === ApplicationStatus.DRAFT
    ).length;
  });

  loanColumns: string[] = ['loanNumber', 'productName', 'principalAmount', 'emiAmount', 'outstandingAmount', 'status', 'actions'];
  applicationColumns: string[] = ['applicationNumber', 'productName', 'requestedAmount', 'tenure', 'submittedDate', 'status', 'actions'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    // Fetch statistics
    this.loanService.getStatistics().subscribe({
      next: (stats) => this.statistics.set(stats),
      error: () => console.warn('Statistics endpoint unavailable, deriving from records')
    });

    // Fetch loans
    this.loanService.getAllLoans().subscribe({
      next: (loansData) => {
        this.loans.set(loansData || []);
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading loans:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });

    // Fetch applications
    this.loanService.getAllApplications().subscribe({
      next: (appsData) => {
        this.applications.set(appsData || []);
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading loan applications:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  private checkLoadingComplete(): void {
    this.isLoading.set(false);
  }

  onApply(): void {
    this.router.navigate(['/loan/apply']);
  }

  viewLoan(loan: Loan): void {
    this.router.navigate(['/loan', loan.id]);
  }

  viewApplication(app: LoanApplication): void {
    this.router.navigate(['/loan/application', app.id]);
  }
}
