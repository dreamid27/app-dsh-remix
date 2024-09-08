import { AxiosInstance } from "axios";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export interface IPostAccountBank {
  gid: string;
  data: {
    id?: string;
    bank_name: string;
    account_number: string;
    account_owner: string;
  };
}

export const postAccountBank = async (
  httpClient: AxiosInstance,
  { gid, data }: IPostAccountBank,
  user: string
) => {
  const response = await httpClient.post(
    `${API_URL}/bank-accounts?group_id=${gid}&user=${user}`,
    data
  );
  return response.data;
};

export const patchAccountBank = async (
  httpClient: AxiosInstance,
  { gid, data }: IPostAccountBank,
  user: string
) => {
  const response = await httpClient.patch(
    `${API_URL}/bank-accounts/${data.id}?group_id=${gid}&user=${user}`,
    data
  );
  return response.data;
};

export const getAccountBanks = async (
  httpClient: AxiosInstance,
  gid: string
) => {
  const response = await httpClient.get(
    `${API_URL}/bank-accounts?group_id=${gid}`
  );
  return response.data;
};

export const deleteAccountBank = async (
  httpClient: AxiosInstance,
  id: string,
  group_id: string,
  user: string
) => {
  const response = await httpClient.delete(`${API_URL}/bank-accounts/${id}`, {
    params: {
      group_id: group_id,
      user: user,
    },
  });
  return response.data;
};

export const patchBusinessLogo = async (
  httpClient: AxiosInstance,
  { file, gid }: { file: File; gid: string }
) => {
  const formData = new FormData();
  formData.append("files", file);

  const resp = await httpClient.patch(
    `${API_URL}/group/${gid}/business-logo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return resp;
};
