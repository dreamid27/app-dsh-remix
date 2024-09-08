import axios, { AxiosInstance } from 'axios';
import { format } from 'date-fns';

interface ISetup {
  uid?: number | string;
  gid?: string;
  files: File[];
  type: string;
}

export interface IResponseUpload {
  status: string;
  message: string;
  data: FileDetail[];
}

export interface FileDetail {
  filename: string;
  url: string;
}

export interface IFilesInfo {
  name: string;
  originalFilename: string;
  thumbnailLink: string;
  mimeType: string;
  createdTime: string;
  formattedCreatedTime: string;
}

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || '';

export const postUploadFiles = (
  httpClient: AxiosInstance,
  { uid, gid, files, type }: ISetup
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const resp = httpClient.post<IResponseUpload>(
    `${API_URL}/files/upload?uid=${uid}&gid=${gid}&type=${type}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return resp;
};

export const uploadPaymentInvoicePhoto = async (
  httpClient: AxiosInstance,
  files: File[]
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const resp = await httpClient.post<{
    public_url: string;
  }>(`${API_URL}/files/upload-supa/payment_invoice_photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return resp.data;
};

export const getFileInfo = async (
  httpClient: AxiosInstance,
  fileId: string
) => {
  return httpClient.get(`${API_URL}/files/${fileId}/info`).then((resp) => {
    const data = resp.data;
    const formatDate = 'dd MMM yyyy, HH:mm';

    const responseFile: IFilesInfo = {
      name: data.name,
      originalFilename: data.originalFilename,
      thumbnailLink: data.thumbnailLink,
      mimeType: data.mimeType,
      createdTime: data.createdTime,
      formattedCreatedTime: format(new Date(data.createdTime), formatDate),
    };

    return responseFile;
  });
};

export const getFile = async (fid: string) => {
  return axios.get(`${API_URL}/files/${fid}`).then((res) => res.data);
};
