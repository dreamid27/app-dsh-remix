import { AxiosInstance } from "axios";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export interface ILeads {
  name: string;
  company_name: string;
  phone_number: string;
  email?: string;
  business_category: string;
  has_credit_card: boolean;
  business_omzet: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
}

export const postLeads = async (httpClient: AxiosInstance, data: ILeads) => {
  const response = await httpClient.post(`${API_URL}/leads`, data);
  return response.data;
};
