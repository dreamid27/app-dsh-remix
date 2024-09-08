import { AxiosInstance } from "axios";
import { format } from "date-fns";
import fileDownload from "js-file-download";
import { BO_URL } from "tests/mock";
import {
  checkIsInAppWebView,
  flutterHandleDownloadBlob,
} from "utils/constants/flutter_handler";

export enum PaymentPageType {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export interface ITransferRequest {
  id: string;
  unique_code: string;
  customer_id: string | null;
  group_id: string | null;
  name: string;
  phone_number: string;
  business_name: string;
  email: string;
  disburse_requests: IDisburseRequest[];
  early_settlement?: boolean;
}

export interface ITransferRequestResponse {
  id: string;
  unique_code: string;
  status: string;
  external_payment_link: string;
  payment_page_type: PaymentPageType;
}

export interface IDisburseRequest {
  id?: string;
  account_holder_name: string;
  account_number: string;
  bank_code: string;
  nominal: number;
  description?: string;
}

export interface IDisburseInquiryResponse {
  estimated_disburse_nominal: number;
  estimated_early_settlement_fee_nominal: number;
  estimated_fee_nominal: number;
  estimated_total_nominal: number;
}

export interface IPaymentRequestInfoResponse {
  fee_percentage: number;
  early_settlement_fee_percentage: number;
  early_settlement_enable: boolean;
}

export interface IPaymentRequestResponse {
  id: string;
  name: string;
  phone_number: string;
  created_at: string;
  total_amount: number;
  requested_amount: number;
  ref_id: string;
  fee_amount: number;
  unique_code: string;
  fee_percentage: string;
  status: string;
  paid_at: any;
  payment_link: string;
  payment_page_type?: PaymentPageType;
  disburse_request_count: number;
  disburse_requests: Array<{
    id: string;
    account_holder_name: string;
    account_number: string;
    proof_link: any;
    bank_code: string;
    nominal: number;
  }>;
  early_settlement?: boolean;
  early_settlement_fee_amount?: number;
  early_settlement_fee_percentage?: number; // float
}

export const requestTransfer = async (
  httpClient: AxiosInstance,
  payload: ITransferRequest,
  is_test?: boolean
) => {
  return (
    await httpClient.post<ITransferRequestResponse>(
      `${process.env.NEXT_PUBLIC_DELEGASI_API}/payments/payment-request`,
      payload,
      {
        params: { ...(is_test && { is_test: "true" }) },
      }
    )
  ).data;
};

export const requestDisburseInquiry = async (
  httpClient: AxiosInstance,
  payload: {
    data: IDisburseRequest[];
    group_id: string;
    early_settlement?: boolean;
  }
) => {
  return (
    await httpClient.post<IDisburseInquiryResponse>(
      `${process.env.NEXT_PUBLIC_DELEGASI_API}/payments/disburse-request-inquiry`,
      payload
    )
  ).data;
};

export const requestPaymentInfo = async (
  httpClient: AxiosInstance,
  group_id: string
) => {
  return (
    await httpClient.get<IPaymentRequestInfoResponse>(
      `${process.env.NEXT_PUBLIC_DELEGASI_API}/payments/payment-request-info/${group_id}`
    )
  ).data;
};

// convert to typescript

// make api get from /api/payment-request
export const requestPaymentRequest = async (
  httpClient: AxiosInstance,
  {
    group_id,
    page,
    status,
  }: {
    group_id: string;
    page: number;
    status?: string;
  }
) => {
  return (
    await httpClient.get<IPaymentRequestResponse[]>(
      `${process.env.NEXT_PUBLIC_DELEGASI_API}/payments/payment-request`,
      {
        params: {
          ...(status && { statuses: [status] }),
          group_id,
          page,
        },
      }
    )
  ).data;
};

// make api get from /api/payment-request/:uuid
export const requestPaymentRequestDetail = async (
  httpClient: AxiosInstance,
  uuid: string
) => {
  return (
    await httpClient.get<IPaymentRequestResponse>(
      `${process.env.NEXT_PUBLIC_DELEGASI_API}/payments/payment-request/${uuid}`
    )
  ).data;
};

export const payPaymentRequestCreditCard = async (
  httpClient: AxiosInstance,
  uuid: string,
  dto: {
    card_number: string;
    card_month: string;
    card_year: string;
    card_cvv: string;
  }
) => {
  return (
    await httpClient.post<{ provider: string; redirect_url?: string }>(
      `${process.env.NEXT_PUBLIC_DELEGASI_API}/payments/payment-request/${uuid}/credit-card`,
      dto
    )
  ).data;
};

export const fetchPaymentLink = async (
  httpClient: AxiosInstance,
  unique_code: string
) => {
  return (
    await httpClient.get<{
      external_payment_link: string;
      id: string;
      paid_at: string;
    }>(
      `${process.env.NEXT_PUBLIC_DELEGASI_API}/payments/external-payment-link/${unique_code}`
    )
  ).data;
};

export const fetchDisburseRequest = async (
  httpClient: AxiosInstance,
  disburse_request_id: string
) => {
  return (
    await httpClient.get<{ proof_link: string }>(
      `${process.env.NEXT_PUBLIC_DELEGASI_API}/payments/disburse-request/${disburse_request_id}`
    )
  ).data;
};

export interface IDisburseDestination {
  bank_code: string;
  account_number: string;
  account_holder_name: string;
}

interface IFetchPaymentDestinationsParams {
  groupId: string;
  page?: number;
  size?: number;
  q?: string;
  sort_by?: string;
  sort_type?: "ASC" | "DESC";
}

export const fetchPaymentDestinations = async (
  httpClient: AxiosInstance,
  params: IFetchPaymentDestinationsParams
) => {
  const {
    groupId,
    page = 1, // Default to page 1
    size = 25, // Default to size 25
    q,
    sort_by,
    sort_type = "ASC", // Default to ascending order
  } = params;

  // Construct params object conditionally
  const queryParams: any = {
    group_id: groupId,
    page,
    size,
    sort_type,
  };

  // Only add these properties if they are not undefined
  if (q !== undefined) {
    queryParams.q = q;
  }
  if (sort_by !== undefined) {
    queryParams.sort_by = sort_by;
  }

  return (
    await httpClient.get<IDisburseDestination[]>(
      `${process.env.NEXT_PUBLIC_DELEGASI_API}/payments/disburse-destinations`,
      {
        params: queryParams,
      }
    )
  ).data;
};

export const getPaymentInvoicePDF = async (
  httpClient: AxiosInstance,
  id: string
) => {
  const res = await httpClient.get<Blob>(
    `${BO_URL}/payments/payment-invoice/${id}/generate-invoice`,
    {
      responseType: "blob",
    }
  );

  return res.data;
};

export const downloadInvoicePDF = async ({
  file,
  base64String,
}: {
  file: Uint8Array;
  base64String: string;
}) => {
  const fileName = `Invoice_${format(new Date(), "ddMMMyyyy")}.pdf`;

  if (checkIsInAppWebView()) {
    flutterHandleDownloadBlob({
      base64: base64String as string,
      fileName,
    });
  } else {
    fileDownload(file, fileName);
  }
};
