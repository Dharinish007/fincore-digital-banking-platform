export interface BalanceFilterCriteria {
  startDate?: string | null;
  endDate?: string | null;
  branch?: string;
  accountType?: string;
  status?: string;
  customerSearch?: string;
  accountNumberSearch?: string;
}
