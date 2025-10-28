export interface Transaction {
  transaction_id: string;
  customer_id: string;
  transaction_amount: string | number;
  channel: string;
  timestamp: string;
  is_fraud: boolean | string | number;
  kyc_verified: string | boolean; 
}
