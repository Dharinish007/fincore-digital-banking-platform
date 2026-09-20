import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DashboardSummary, SummaryCard, Notification, Activity, DashboardChartData } from '../models/dashboard.model';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

export interface DashboardTransaction {
  id: string | number;
  accountId?: string;
  accountNumber?: string;
  sourceAccountNumber?: string;
  destinationAccountNumber?: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  reference?: string;
  referenceId?: string;
  description?: string;
  remarks?: string;
  createdAt: string;
}

export interface DashboardSummaryResponse {
  totalCustomers: number;
  totalAccounts: number;
  totalVolume: number;
  activeUsers: number;
  recentTransactionsCount: number;
  customers?: {
    totalCustomers?: number;
    activeCustomers?: number;
  };
  accounts?: {
    totalAccounts?: number;
    totalBalance?: number;
  };
  transactions?: {
    totalTransactions?: number;
    totalDepositAmount?: number;
  };
}

export interface DashboardRecentTransactionsResponse {
  content: DashboardTransaction[];
  totalElements?: number;
  totalPages?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiService = inject(ApiService);
  private readonly endpoint = API_ENDPOINTS.DASHBOARD.SUMMARY.replace('/summary', '');

  getSummary(): Observable<DashboardSummary> {
    return this.apiService.get<DashboardSummaryResponse>(API_ENDPOINTS.DASHBOARD.SUMMARY).pipe(
      map(raw => {
        if (raw && (raw.customers || raw.accounts || raw.transactions)) {
          return {
            totalCustomers: raw.customers?.totalCustomers ?? (raw.totalCustomers ?? 0),
            totalAccounts: raw.accounts?.totalAccounts ?? (raw.totalAccounts ?? 0),
            totalVolume: raw.transactions?.totalDepositAmount ?? (raw.accounts?.totalBalance ?? (raw.totalVolume ?? 0)),
            activeUsers: raw.customers?.activeCustomers ?? (raw.activeUsers ?? 0),
            recentTransactionsCount: raw.transactions?.totalTransactions ?? (raw.recentTransactionsCount ?? 0)
          };
        }
        return raw as DashboardSummary;
      })
    );
  }

  getSummaryCards(): Observable<SummaryCard[]> {
    return this.apiService.get<SummaryCard[]>(`${this.endpoint}/summary-cards`);
  }

  getRecentTransactions(): Observable<DashboardTransaction[]> {
    return this.apiService.get<DashboardRecentTransactionsResponse>(`${this.endpoint}/recent-transactions`)
      .pipe(map(res => res?.content || []));
  }

  getNotifications(): Observable<Notification[]> {
    return this.apiService.get<Notification[]>(`${this.endpoint}/notifications`);
  }

  getActivityTimeline(): Observable<Activity[]> {
    return this.apiService.get<Activity[]>(`${this.endpoint}/activity-timeline`);
  }

  getMonthlyTransactionsChart(): Observable<DashboardChartData> {
    return this.apiService.get<DashboardChartData>(`${this.endpoint}/charts/monthly-transactions`);
  }

  getDepositsVsWithdrawalsChart(): Observable<DashboardChartData> {
    return this.apiService.get<DashboardChartData>(`${this.endpoint}/charts/deposits-vs-withdrawals`);
  }

  getCustomerGrowthChart(): Observable<DashboardChartData> {
    return this.apiService.get<DashboardChartData>(`${this.endpoint}/charts/customer-growth`);
  }
}
