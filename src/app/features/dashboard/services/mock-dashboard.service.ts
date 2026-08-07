import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { DashboardService, DashboardTransaction } from './dashboard.service';
import { 
  DashboardSummary, 
  SummaryCard, 
  Notification, 
  Activity 
} from '../models/dashboard.model';
import {
  DASHBOARD_SUMMARY_MOCK,
  SUMMARY_CARDS_MOCK,
  DASHBOARD_RECENT_TRANSACTIONS_MOCK,
  NOTIFICATIONS_MOCK,
  ACTIVITY_TIMELINE_MOCK,
  MONTHLY_TRANSACTIONS_CHART_MOCK,
  DEPOSITS_VS_WITHDRAWALS_CHART_MOCK,
  CUSTOMER_GROWTH_CHART_MOCK
} from '../../../core/mocks/dashboard.mock';

@Injectable({
  providedIn: 'root'
})
export class MockDashboardService implements DashboardService {
  
  private simulateNetworkDelay<T>(data: T, delayMs: number = 800): Observable<T> {
    return of(data).pipe(delay(delayMs));
  }

  getSummary(): Observable<DashboardSummary> {
    return this.simulateNetworkDelay(DASHBOARD_SUMMARY_MOCK);
  }

  getSummaryCards(): Observable<SummaryCard[]> {
    return this.simulateNetworkDelay(SUMMARY_CARDS_MOCK);
  }

  getRecentTransactions(): Observable<DashboardTransaction[]> {
    return this.simulateNetworkDelay(DASHBOARD_RECENT_TRANSACTIONS_MOCK);
  }

  getNotifications(): Observable<Notification[]> {
    return this.simulateNetworkDelay(NOTIFICATIONS_MOCK);
  }

  getActivityTimeline(): Observable<Activity[]> {
    return this.simulateNetworkDelay(ACTIVITY_TIMELINE_MOCK);
  }

  // --- Charts Mock Data ---

  getMonthlyTransactionsChart(): Observable<any> {
    return this.simulateNetworkDelay(MONTHLY_TRANSACTIONS_CHART_MOCK);
  }

  getDepositsVsWithdrawalsChart(): Observable<any> {
    return this.simulateNetworkDelay(DEPOSITS_VS_WITHDRAWALS_CHART_MOCK);
  }

  getCustomerGrowthChart(): Observable<any> {
    return this.simulateNetworkDelay(CUSTOMER_GROWTH_CHART_MOCK);
  }
}
