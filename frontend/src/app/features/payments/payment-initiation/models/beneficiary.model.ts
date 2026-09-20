export interface Beneficiary {
  beneficiary_id: number;
  customer_id: number;
  beneficiary_name: string;
  account_no: string;
  ifsc_code: string;
  bank_name: string;
  beneficiary_type: 'Internal' | 'External';
  status: 'Pending' | 'Verified' | 'Blocked';
  created_at?: string;
}
