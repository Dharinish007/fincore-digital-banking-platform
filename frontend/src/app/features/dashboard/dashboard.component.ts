import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, catchError, of, tap, map } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { DashboardService, DashboardTransaction } from './services/dashboard.service';
import { Role } from '../../core/models/auth.models';
import { 
  DashboardSummary, 
  SummaryCard, 
  QuickAction, 
  Notification, 
  Activity,
  DashboardChartData
} from './models/dashboard.model';

import { StatisticCardComponent } from '../../shared/components/statistic-card/statistic-card.component';
import { CardContainerComponent } from '../../shared/components/card-container/card-container.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { DashboardWelcomeBannerComponent } from './components/welcome-banner/welcome-banner.component';
import { DashboardQuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { DashboardChartWidgetComponent } from './components/chart-widget/chart-widget.component';
import { DashboardTransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { DashboardNotificationPanelComponent } from './components/notification-panel/notification-panel.component';
import { DashboardActivityTimelineComponent } from './components/activity-timeline/activity-timeline.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatisticCardComponent,
    CardContainerComponent,
    LoadingSpinnerComponent,
    DashboardWelcomeBannerComponent,
    DashboardQuickActionsComponent,
    DashboardChartWidgetComponent,
    DashboardTransactionsTableComponent,
    DashboardNotificationPanelComponent,
    DashboardActivityTimelineComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  Role = Role; // Expose enum to template
  
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  hasError = false;
  isLoading = true;

  user = this.authService.getCurrentUser();
  role = this.authService.getCurrentRole();

  // Observables for Async Pipe
  summary$!: Observable<DashboardSummary | undefined>;
  kpiCards$!: Observable<SummaryCard[]>;
  recentTransactions$!: Observable<DashboardTransaction[]>;
  notifications$!: Observable<Notification[]>;
  activityTimeline$!: Observable<Activity[]>;
  
  // Chart Observables
  monthlyTransactionsChart$!: Observable<DashboardChartData | undefined>;
  depositsVsWithdrawalsChart$!: Observable<DashboardChartData | undefined>;
  customerGrowthChart$!: Observable<DashboardChartData | undefined>;

  quickActions: QuickAction[] = [
    { label: 'Apply for Loan', icon: 'post_add', route: '/loan/apply', roles: [Role.CUSTOMER] },
    { label: 'Underwrite Loans', icon: 'fact_check', route: '/loan/review', roles: [Role.EMPLOYEE] },
    { label: 'Loan Products', icon: 'inventory_2', route: '/admin/loan-products', roles: [Role.ADMIN] },
    { label: 'Add Customer', icon: 'person_add', route: '/customer/new', roles: [Role.ADMIN, Role.EMPLOYEE] },
    { label: 'Open Account', icon: 'account_balance', route: '/account/new', roles: [Role.ADMIN, Role.EMPLOYEE] },
    { label: 'Transfer Funds', icon: 'swap_horiz', route: '/transaction/new', roles: [Role.ADMIN, Role.EMPLOYEE, Role.CUSTOMER] }
  ];

  filteredQuickActions: QuickAction[] = [];

  ngOnInit(): void {
    this.filterQuickActions();
    this.loadDashboardData();
  }

  private filterQuickActions(): void {
    if (this.role) {
      this.filteredQuickActions = this.quickActions.filter(action => 
        !action.roles || action.roles.includes(this.role!)
      );
    } else {
      this.filteredQuickActions = this.quickActions;
    }
  }

  loadDashboardData(): void {
    this.hasError = false;
    this.isLoading = true;

    if (this.role === Role.ADMIN || this.role === Role.EMPLOYEE) {
      this.summary$ = this.dashboardService.getSummary().pipe(
        tap(() => {
          this.hasError = false;
          this.isLoading = false;
        }),
        catchError(() => {
          this.hasError = true;
          this.isLoading = false;
          return of(undefined);
        })
      );

      this.kpiCards$ = this.dashboardService.getSummaryCards().pipe(
        map(cards => {
          const variants: ('emerald' | 'blue' | 'amber' | 'rose')[] = ['emerald', 'blue', 'blue', 'amber'];
          const colors = [
            { icon: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
            { icon: 'var(--color-accent)', bg: 'var(--color-accent-light)' },
            { icon: 'var(--color-accent)', bg: 'var(--color-accent-light)' },
            { icon: 'var(--color-warning)', bg: 'var(--color-warning-bg)' }
          ];

          return (cards || []).slice(0, 4).map((c, i) => ({
            ...c,
            cardVariant: variants[i % variants.length],
            iconColor: colors[i % colors.length].icon,
            iconBgColor: colors[i % colors.length].bg
          }));
        }),
        catchError(() => of([
          { title: 'Total Volume', value: '$45.2M', icon: 'account_balance', trend: 8.4, cardVariant: 'emerald' as const, iconColor: 'var(--color-primary)', iconBgColor: 'var(--color-primary-light)' },
          { title: 'Total Customers', value: '12,450', icon: 'people_alt', trend: 5.2, cardVariant: 'blue' as const, iconColor: 'var(--color-accent)', iconBgColor: 'var(--color-accent-light)' },
          { title: 'Active Accounts', value: '28,930', icon: 'account_balance_wallet', trend: 2.1, cardVariant: 'blue' as const, iconColor: 'var(--color-accent)', iconBgColor: 'var(--color-accent-light)' },
          { title: 'Transactions Today', value: '1,420', icon: 'swap_horiz', trend: 12.1, cardVariant: 'amber' as const, iconColor: 'var(--color-warning)', iconBgColor: 'var(--color-warning-bg)' }
        ]))
      );

      this.recentTransactions$ = this.dashboardService.getRecentTransactions().pipe(
        catchError(() => of([]))
      );

      this.notifications$ = this.dashboardService.getNotifications().pipe(
        catchError(() => of([]))
      );

      this.activityTimeline$ = this.dashboardService.getActivityTimeline().pipe(
        catchError(() => of([]))
      );

      this.monthlyTransactionsChart$ = this.dashboardService.getMonthlyTransactionsChart().pipe(
        catchError(() => of(undefined))
      );

      this.depositsVsWithdrawalsChart$ = this.dashboardService.getDepositsVsWithdrawalsChart().pipe(
        catchError(() => of(undefined))
      );

      this.customerGrowthChart$ = this.dashboardService.getCustomerGrowthChart().pipe(
        catchError(() => of(undefined))
      );
    } else {
      this.isLoading = false;
      this.notifications$ = this.dashboardService.getNotifications().pipe(
        catchError(() => of([]))
      );
      this.recentTransactions$ = this.dashboardService.getRecentTransactions().pipe(
        catchError(() => of([]))
      );
    }
  }

  viewAllTransactions(): void {
    this.router.navigate(['/transaction']);
  }

  hasRole(allowedRoles: Role[]): boolean {
    return this.role ? allowedRoles.includes(this.role) : false;
  }
}
