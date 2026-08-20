export interface FraudCheck {
  fraud_check_id?: number;
  payment_id: number;
  risk_score: number;
  fraud_status: 'Pending' | 'Safe' | 'Suspicious' | 'Blocked';
  rule_triggered?: string;
  remarks?: string;
  checked_at?: string;
}
