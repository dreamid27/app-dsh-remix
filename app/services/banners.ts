import { AxiosInstance } from "axios";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export interface IBannerParams {
  is_active: boolean;
  category: string;
}

export interface IBanner {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  priority: number;
  cta_text: string;
  cta_link: string;
  is_external_link?: boolean;
  is_active?: boolean;
  tracking_key?: string;
  frequency?: string;
}

export enum BannerCategory {
  FEATURE_HIGHLIGHT = "Feature Higlight",
  GUEST = "Guest",
  IN_APP = "In App",
}

export const getCustomerBanners = async (
  httpClient: AxiosInstance,
  params: IBannerParams
) => {
  return httpClient
    .get<IBanner[]>(`${API_URL}/cms/banners/customers`, {
      params,
    })
    .then((res) => res.data);
};

export const getGuestBanners = async (
  httpClient: AxiosInstance,
  params: IBannerParams
) => {
  return httpClient
    .get<IBanner[]>(`${API_URL}/cms/banners/guests`, {
      params,
    })
    .then((res) => res.data);
};
