import { AxiosInstance } from "axios";
import httpClient from "utils/providers/dataProvider";
import {
  mockCreatePaymentLink,
  mockDataPaymentLink,
  mockDataPaymentLinkDetail,
  mockDataPaymentLinkSummaries,
  mockGeneratePaymentLink,
  mockSaldoHistories,
  mockSaldoSummary,
} from "./payment-invoice.mocks";
import { PaymentPageType } from "./payments";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export interface IPaymentLink {
  id: string;
  buyer_name: string;
  buyer_phone_number?: string;
  ref_id: string;
  invoice_number: string;
  invoice_date: string;
  requested_amount: number;
  fee_amount: number;
  fee_charged_to: string;
  total_amount: number;
  due_date: string;
  note: string;
  status: string;
  paid_at: string;
  unique_code: string;
  fee_percentage: number;
  seller_name?: string;
  seller_logo?: string;
  payment_page_type?: PaymentPageType;
  payment_request_id?: string;
  items?: Array<IPaymentLinkItem>;
  view_version?: number;
}

export interface IPaymentParams {
  group_id: string;
  statuses?: string[];
  size?: number;
  page?: number;
}

export const getPaymentLink = async (
  httpClient: AxiosInstance,
  params: IPaymentParams
) => {
  const response = await httpClient.get<IPaymentLink[]>(
    `${API_URL}/payments/payment-invoice`,
    {
      params,
    }
  );

  return response.data;
};

export interface IPaymentLinkItem {
  product_name: string;
  price_per_unit: number;
  quantity: number;
  photo_link?: string;
  external_product_link?: string;
}

export interface IPaymentLinkForm {
  id?: string;
  buyer_name: string;
  buyer_phone_number?: string;
  invoice_number: string;
  invoice_date: string;
  requested_amount: number;
  fee_charged_to: string;
  due_date: string;
  note: string;
  group_id: string;
  items?: Array<IPaymentLinkItem>;
}

export const createPaymentLink = async (
  httpClient: AxiosInstance,
  data: IPaymentLinkForm
) => {
  const response = await httpClient.post<IPaymentLink>(
    `${API_URL}/payments/payment-invoice`,
    data
  );

  return response.data;
};

export interface IPaymentLinkFormEdit {
  id?: string;
  buyer_name?: string;
  invoice_number?: string;
  invoice_date?: string;
  requested_amount?: number;
  fee_charged_to?: string;
  total_amount?: number;
  due_date?: string;
  note?: string;
  status?: string;
}

export const patchPaymentLink = async (
  httpClient: AxiosInstance,
  data: IPaymentLinkFormEdit
) => {
  const response = await httpClient.patch<IPaymentLink>(
    `${API_URL}/payments/payment-invoice/${data.id}`,
    data
  );
  return response.data;
};

export const deletePaymentLink = async (
  httpClient: AxiosInstance,
  id: string
) => {
  const response = await httpClient.delete<IPaymentLink>(
    `${API_URL}/payments/payment-invoice/${id}`
  );
  return response.data;
};

// get payment link by id
export const getPaymentLinkById = async (
  httpClient: AxiosInstance,
  id: string
) => {
  const response = await httpClient.get<IPaymentLink>(
    `${API_URL}/payments/payment-invoice/${id}`
  );
  return response.data;
};

export const getPaymentLinkByCode = async (
  httpClient: AxiosInstance,
  code: string
) => {
  const response = await httpClient.get<IPaymentLink>(
    `${API_URL}/payments/payment-invoice/code/${code}`
  );
  return response.data;
};

export const getPaymentPay = async (httpClient: AxiosInstance, id: string) => {
  const response = await httpClient.get<{
    external_payment_link: string;
  }>(`${API_URL}/payments/payment-invoice/${id}/pay`);
  return response.data;
};

export interface IPaymentInvoiceInfo {
  fee_percentage: number; // float
  fee_amount: number | null; // null kalau requested_amountnya kosong
  total_amount: number | null; // null kalau requested_amountnya kosong
}

export const getPaymentInfo = async (
  httpClient: AxiosInstance,
  params: {
    group_id: string;
    requested_amount: number;
    fee_charged_to: string;
  }
) => {
  const response = await httpClient.get<IPaymentInvoiceInfo>(
    `${API_URL}/payments/payment-invoice-info`,
    {
      params,
    }
  );
  return response.data;
};

export interface IPaymentLinkSummary {
  status: string;
  count: number;
  total_amount: number;
}

export const getPaymentLinkSummary = async (
  httpClient: AxiosInstance,
  group_id: string
) => {
  const response = await httpClient.get<IPaymentLinkSummary[]>(
    `${API_URL}/payments/payment-invoice/summaries`,
    {
      params: {
        group_id,
      },
    }
  );

  return response.data;
};

export interface IPaymentLinkGenerate {
  link: string;
}

export const generatePaymentLink = async (
  httpClient: AxiosInstance,
  id: string
) => {
  const response = await httpClient.post<IPaymentLinkGenerate>(
    `${API_URL}/payments/payment-invoice/${id}/generate`
  );

  return response.data;
};

export interface ISaldoHistories {
  id: string;
  category: string; // enum: fee, withdrawal, payment
  amount: number;
  status: string; // enum: settled, unsettled, disbursed, hold
  ref_id: string;
  timestamp: string;
  direction: string; // enum: credit, debit

  metadata: {
    invoice_number: string;
    invoice_date: string;
    payment_invoice_id: string;
    bank_code: string;
    account_number: string;
    account_holder_name: string;
  };
}

export interface ISaldoHistoriesParams {
  group_id: string;
  date_from?: string;
  date_to?: string;
  size?: number;
  page?: number;
  sort?: string;
  statuses?: string[]; //(default: [settled, incoming_hold, disbursed, outgoing_hold])
  transaction_types?: string[]; //(default: [credit, debit])
  categories?: string[]; //(default: [fee, withdrawal, payment]//
}

export const getSaldoHistories = async (
  httpClient: AxiosInstance,
  params: ISaldoHistoriesParams
) => {
  const response = await httpClient.get<ISaldoHistories[]>(
    `${API_URL}/saldo/histories`,
    {
      params: {
        ...params,
      },
    }
  );

  return response.data;
};

export const getSaldoHistoriesById = async (
  httpClient: AxiosInstance,
  id: string
) => {
  const response = await httpClient.get<ISaldoHistories>(
    `${API_URL}/saldo/histories/${id}`
  );
  return response.data;
};

export interface ISaldo {
  total_saldo: number;
  settled_saldo: number;
  unsettled_saldo: number;
}

export const getSaldo = async (httpClient: AxiosInstance, groupId: string) => {
  const response = await httpClient.get<ISaldo>(`${API_URL}/saldo`, {
    params: {
      group_id: groupId,
    },
  });

  return response.data;
};

export const withdrawSaldo = async (
  httpClient: AxiosInstance,
  {
    id,
    groupId,
    nominal,
  }: {
    id: string;
    groupId: string;
    nominal: number;
  }
) => {
  const response = await httpClient.post(`${API_URL}/saldo/withdrawal`, {
    id,
    group_id: groupId,
    nominal,
  });

  return response.data;
};
