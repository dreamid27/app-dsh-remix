import { AxiosInstance } from "axios";
import fileDownload from "js-file-download";

import {
  IDocumentWrapper,
  IItems,
  IPayment,
} from "components/organism/receivable/contants/interface";
import {
  checkIsInAppWebView,
  flutterHandleDownloadBlob,
} from "utils/constants/flutter_handler";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_ACC_API || "";

export interface PaymentDocument {
  url: string;
  filename: string;
}

export interface IReceivableMutation {
  id: string;
  group_id: string;
  type?: string;
  invoice_code?: string;
  due_date?: string;
  issued_date?: string;
  partner_name?: string;
  partner_address?: string;
  partner_email?: string | null;
  partner_phone?: string | null;
  amount?: number | null;
  discount_amount?: number;
  note?: string;
  payments?: IPayment[];
  items?: IItems[];
  documents?: IDocumentWrapper;
}

export const patchReceivable = async (
  httpClient: AxiosInstance,
  data: IReceivableMutation
) => {
  //call api
  const resp = httpClient.patch(`${API_URL}/v1/receivables`, data);
  return resp;
};

export const deleteReceivable = async (
  httpClient: AxiosInstance,
  group_id: string,
  id: string
) => {
  const resp = httpClient.delete(
    `${API_URL}/v1/receivables/${id}?group_id=${group_id}`
  );
  return resp;
};

export const downloadInvoice = async (
  httpClient: AxiosInstance,
  id: string,
  group_id: string,
  isDownloaded: boolean,
  fileName?: string
) => {
  const resp = await httpClient.get(
    `${API_URL}/v1/receivables/${id}/invoice?group_id=${group_id}`,
    {
      responseType: "blob",
    }
  );

  if (isDownloaded) {
    if (checkIsInAppWebView()) {
      // Convert the content to base64
      const base64Content = window.btoa(resp.data);
      flutterHandleDownloadBlob({
        base64: base64Content,
        fileName: fileName || "invoice.pdf",
      });
    } else {
      fileDownload(resp.data, fileName || "invoice.pdf");
    }
  }

  return resp.data;
};
