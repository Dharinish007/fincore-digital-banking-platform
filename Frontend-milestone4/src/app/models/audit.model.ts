export interface AuditLog {
  auditId: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  description: string;
  timestamp: string;
}

export interface AuditFilter {
  searchQuery: string;
  user: string;
  module: string;
  action: string;
  status: string;
  fromDate: string;
  toDate: string;
}
