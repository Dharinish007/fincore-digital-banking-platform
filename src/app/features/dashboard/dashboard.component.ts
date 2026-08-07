import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { MockDashboardService } from './services/mock-dashboard.service';
import { Role } from '../../core/models/auth.models';
import { 
  DashboardSummary, 
  SummaryCard, 
  QuickAction, 
  Notification, 
  Activity 
} from './models/dashboard.model';
import { DashboardTransaction } from './services/dashboard.service';

import { StatisticCardComponent } from '../../shared/components/statistic-card/statistic-card.component';
import { CardContainerComponent } from '../../shared/components/card-container/card-container.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

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
  private dashboardService = inject(MockDashboardService);

  user = this.authService.getCurrentUser();
  role = this.authService.getCurrentRole();

  // Observables for Async Pipe
  summary$!: Observable<DashboardSummary>;
  summaryCards$!: Observable<SummaryCard[]>;
  recentTransactions$!: Observable<DashboardTransaction[]>;
  notifications$!: Observable<Notification[]>;
  activityTimeline$!: Observable<Activity[]>;
  
  // Chart Observables
  monthlyTransactionsChart$!: Observable<any>;
  depositsVsWithdrawalsChart$!: Observable<any>;
  customerGrowthChart$!: Observable<any>;

  quickActions: QuickAction[] = [
    { label: 'Add Customer', icon: 'person_add', route: '/customers/new', roles: [Role.ADMIN, Role.EMPLOYEE] },
    { label: 'Open Account', icon: 'account_balance', route: '/accounts/new', roles: [Role.ADMIN, Role.EMPLOYEE] },
    { label: 'Transfer Funds', icon: 'sync_alt', route: '/transactions/new', roles: [Role.ADMIN, Role.EMPLOYEE, Role.CUSTOMER] },
    { label: 'View Reports', icon: 'assessment', route: '/reports', roles: [Role.ADMIN] },
    { label: 'Manage Roles', icon: 'manage_accounts', route: '/admin/roles', roles: [Role.ADMIN] },
    { label: 'Support Ticket', icon: 'support_agent', route: '/support', roles: [Role.CUSTOMER] }
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
    }
  }

  private loadDashboardData(): void {
    this.summaryCards$ = this.dashboardService.getSummaryCards();
    this.recentTransactions$ = this.dashboardService.getRecentTransactions();
    
    // Role based data loading
    if (this.role === Role.ADMIN || this.role === Role.EMPLOYEE) {
      this.summary$ = this.dashboardService.getSummary();
      this.monthlyTransactionsChart$ = this.dashboardService.getMonthlyTransactionsChart();
      this.depositsVsWithdrawalsChart$ = this.dashboardService.getDepositsVsWithdrawalsChart();
      this.customerGrowthChart$ = this.dashboardService.getCustomerGrowthChart();
      this.activityTimeline$ = this.dashboardService.getActivityTimeline();
    }
    
    this.notifications$ = this.dashboardService.getNotifications();
  }

  hasRole(allowedRoles: Role[]): boolean {
    return this.role ? allowedRoles.includes(this.role) : false;
  }
}
