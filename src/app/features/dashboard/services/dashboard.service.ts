import { Observable } from 'rxjs';
import { 
  DashboardSummary, 
  SummaryCard, 
  Notification, 
  Activity 
} from '../models/dashboard.model';

// Lightweight transaction view model for dashboard widget only
export interface DashboardTransaction {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  description: string;
  createdAt: string;
}

export abstract class DashboardService {
  abstract getSummary(): Observable<DashboardSummary>;
  abstract getSummaryCards(): Observable<SummaryCard[]>;
  abstract getRecentTransactions(): Observable<DashboardTransaction[]>;
  abstract getNotifications(): Observable<Notification[]>;
  abstract getActivityTimeline(): Observable<Activity[]>;
  
  // Charts Data
  abstract getMonthlyTransactionsChart(): Observable<any>;
  abstract getDepositsVsWithdrawalsChart(): Observable<any>;
  abstract getCustomerGrowthChart(): Observable<any>;
}
