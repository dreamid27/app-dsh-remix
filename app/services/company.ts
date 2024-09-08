import axios from "axios";
import { TypeUpload } from "utils/constants/typeUpload";
import { IIntegrationOutlet } from "utils/model/companyIntegrationModel";

export interface IToDoOutlet {
  total_unchecked_count: number;
  data: IToDoChecklist[];
}

export interface IToDoChecklist {
  type: string;
  unchecked_count: number;
  items: IToDoChecklistItem[];
}

export interface IToDoChecklistItem {
  id: string;
  is_checked: boolean;
  updated_at: string;
}

export interface IIntegrationResponse {
  integrations: IIntegrationOutlet[];
}

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export const getCompanyTodos = async (uid: string) => {
  try {
    const resp = await axios.get<IToDoChecklist[]>(
      `${API_URL}/company/${uid}/todo`
    );

    return {
      total_unchecked_count: Number(resp.headers["x-total-unchecked-count"]),
      data: resp.data,
    };
  } catch (err) {
    throw err;
  }
};

export const getLogFiles = async (gid: string, type: TypeUpload) => {
  return axios
    .get(`${API_URL}/company/${gid}/log-files?type=${type}`)
    .then((res) => res.data);
};

export const getCompanyIntegrations = async (uid: string) => {
  const resp = await axios.get<IIntegrationResponse>(
    `${API_URL}/company/${uid}/integrations`
  );
  return resp.data;
};
