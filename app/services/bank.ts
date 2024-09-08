import { AxiosInstance } from "axios";
import httpClient from "utils/providers/dataProvider";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

interface IBank {
  bankID: number;
  bankName: string;
  clearingCode: string;
  abbreviation: string;
  __typename: string;
}

export const getBanks = async (httpClient: AxiosInstance) => {
  const response = await httpClient.get<IBank[]>(`${API_URL}/banks`);
  return response.data;
};

interface IBankAccount {
  bank_account_name: string;
  bank_account_number: string;
  bank_code: string;
  bank_id: string;
  bypass_validation: boolean;
  country: string;
  created_at: string;
  currency: string;
  status: string;
  updated_at: string;
}

export const getBankAccount = async (
  httpClient: AxiosInstance,
  params: {
    account_number: string;
    bank_code: string;
  }
) => {
  const response = await httpClient.get<IBankAccount>(
    `${API_URL}/banks/account`,
    {
      params,
    }
  );
  return response.data;
};
