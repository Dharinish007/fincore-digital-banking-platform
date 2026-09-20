export interface Payment {
  payment_id?: number;

  from_account_no: string;
  to_account_no: string;

  beneficiary_id?: number;

  amount: number;

  payment_type: "Transfer" | "Bill Payment" | "Other";

  payment_mode: "IMPS" | "NEFT" | "RTGS" | "UPI";

  payment_status?:
    | "Pending"
    | "Processing"
    | "Success"
    | "Failed"
    | "Cancelled";

  transaction_ref?: string;

  description?: string;

  initiated_at?: string;

  updated_at?: string;
}
