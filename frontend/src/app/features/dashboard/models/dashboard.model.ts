import { TransactionStatus, TransactionType } from '../../transaction/models/transaction.model';
import { Role } from '../../../core/models/auth.models';

export interface DashboardSummary {
  totalCustomers: number;
  totalAccounts: number;
  totalVolume: number;
  activeUsers: number;
  recentTransactionsCount: number;
}

export interface SummaryCard {
  title: string;
  value: string | number;
  icon: string;
  trend?: number;
  cardVariant?: 'default' | 'emerald' | 'blue' | 'amber' | 'rose';
  iconBgColor?: string;
  iconColor?: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  route: string;
  roles?: Role[];
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ChartDataset {
  data: number[];
  label: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  fill?: boolean;
}

export interface DashboardChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
}

export interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  icon: string;
  actor: string;
}

export interface Widget {
  id: string;
  title: string;
  visibleForRoles: Role[];
  order: number;
}
