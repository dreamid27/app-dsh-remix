export interface IAccountingTransaction {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
  created_by: string;
  updated_by?: any;
  deleted_by?: any;
  period: string;
  customer_id: string;
  customer_name: string;
  group_id: string;
  group_name: string;
  workpaper_id: string;
  code: string;
  date: string;
  account_name?: any;
  source_account?: any;
  transaction_type: string;
  total: number;
  product_name?: any;
  product_code?: any;
  product_id?: any;
  unit_package?: any;
  qty: number;
  unit_price: number;
  supplier_name?: any;
  invoice_no?: any;
  due_date?: any;
  account_id?: any;
  account_no?: any;
  account_category?: any;
  destination_account?: any;
  remark?: any;
  document?: any;
  is_journaling: boolean;
  is_reconsile: boolean;
  row_position: string;
  union_transaction_type?: string;
  is_anomaly?: boolean;
  transaction_category?: string;
}

export interface IAccountingTransactionSummary {
  amount: number;
  date: string;
}

export interface ITransactionDetailResp {
  code: string;
  date: string;
  name: string;
  unit_price: number;
  formatted_unit_price: string;
  total: number;
  formatted_total: string;
  unit_package: string;
  qty: number;
  document: string;
  transaction_type: string;
  source_account: string;
  union_transaction_type?: string;
  is_anomaly: boolean;
  remark: string;
  transaction_category?: string;
}

export interface IAccountingTransactionIncome {
  status: string;
  order_id: string;
  date: string;
  description: string;
  payment_method: string;
  channel: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface ITransactionResp {
  details: ITransactionDetailResp[];
  total_amount: number;
  total_item: number;
  formatted_total_amount: string;
  formatted_total_item: string;
}

export interface ITransactionSummaryResp {
  amount: number;
  formattedAmount: string;
  date: string;
  formattedDate: string;
}

export enum SortTypes {
  HighestPrice = "highest_price",
  LowestPrice = "lowest_price",
  Older = "older",
  Newest = "newest",
}
