export interface AuditLogItem {
  id: string;
  accountId: string;
  accountNumber: string;
  user: string;
  userRole: string;
  timestamp: string;
  action: string;
  previousBalance: number;
  updatedBalance: number;
  ipAddress: string;
  device: string;
  remarks: string;
}
