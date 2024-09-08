import { AxiosInstance } from "axios";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export interface IAccessFeature {
  is_enabled: boolean;
  message: string;
}

export const getAccessFeature = async (
  httpClient: AxiosInstance,
  name: string,
  customer_id: string
) => {
  try {
    const resp = await httpClient.get<IAccessFeature>(
      `${API_URL}/access-features?name=${name}&customer_id=${customer_id}`
    );
    return resp.data;
  } catch (err) {
    throw err;
  }
};
