export interface FraudCheck {
  fraud_check_id?: number;
  payment_id: number;
  risk_score: number;
  fraud_status: 'Pending' | 'Safe' | 'Suspicious' | 'Blocked';
  rule_triggered?: string;
  remarks?: string;
  checked_at?: string;
}
export interface FraudCheck {
  fraud_check_id?: number;
  payment_id: number;
  risk_score: number;
  fraud_status: 'Pending' | 'Safe' | 'Suspicious' | 'Blocked';
  rule_triggered?: string;
  remarks?: string;
  checked_at?: string;

  // Optional display context (payment/customer snapshot for review screens)
  customer_name?: string;
  beneficiary_name?: string;
  from_account_no?: string;
  to_account_no?: string;
  amount?: number;
  payment_mode?: 'IMPS' | 'NEFT' | 'RTGS' | 'UPI';
}
