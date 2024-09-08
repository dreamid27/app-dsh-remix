import axios, { AxiosInstance } from "axios";
import { UserTokenPlatform } from "utils/constants/token";
import { IRequestMe } from "utils/model/authModel";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export interface IPostProfileUser {
  data: any;
  uid: string;
}

export const getProfileUser = async (
  httpClient: AxiosInstance,
  uid: string
) => {
  const response = await httpClient.get(
    `${API_URL}/user/profile?user_id=${uid}`
  );

  return response.data;
};

export const updateProfileUser = async (
  httpClient: AxiosInstance,
  { uid, data }: IPostProfileUser
) => {
  const response = await httpClient.put(
    `${API_URL}/user/profile?user_id=${uid}`,
    data
  );
  return response.data;
};

export type IRegister = {
  name: string;
  username?: string;
  phone_number: string;
  telegram_user_id?: string;
  business_profile: {
    name: string;
    omzet: string;
    category: string;
    province: string;
    city: string;
    phone_number: string;
  };
};

export const registerUser = async (
  httpClient: AxiosInstance,
  data: IRegister
) => {
  const response = await httpClient.post(`${API_URL}/user/register`, data);

  return response.data;
};

export const getMe = async (token: string) => {
  const resp = await axios.get<IRequestMe>(`${API_URL}/user/me`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return resp.data;
};

export const removeAllPushNotifToken = async (input: {
  jwt?: string;
  onesignal_token?: string;
  firebase_token?: string;
}) => {
  if (!!input.onesignal_token)
    upsertPushNotifToken({
      jwt: input.jwt,
      user_id: null,
      push_notif_token: input.onesignal_token,
      platform: UserTokenPlatform.ONESIGNAL,
    });

  if (!!input.firebase_token)
    upsertPushNotifToken({
      jwt: input.jwt,
      user_id: null,
      push_notif_token: input.firebase_token,
      platform: UserTokenPlatform.FIREBASE,
    });
};

export const upsertAllPushNotifToken = async (input: {
  jwt?: string;
  onesignal_token?: string;
  firebase_token?: string;
  user_id?: string | null;
}) => {
  if (!!input.onesignal_token)
    upsertPushNotifToken({
      jwt: input.jwt,
      user_id: input.user_id,
      push_notif_token: input.onesignal_token,
      platform: UserTokenPlatform.ONESIGNAL,
    });

  if (!!input.firebase_token)
    upsertPushNotifToken({
      jwt: input.jwt,
      user_id: input.user_id,
      push_notif_token: input.firebase_token,
      platform: UserTokenPlatform.FIREBASE,
    });
};

export const upsertPushNotifToken = async (input: {
  jwt?: string;
  push_notif_token?: string;
  user_id?: string | null;
  platform: UserTokenPlatform;
}) => {
  const resp = await axios.patch<any>(
    `${API_URL}/user/token`,
    {
      token: input.push_notif_token,
      user_id: input.user_id,
      platform: input.platform.toString(),
    },
    {
      headers: {
        authorization: `Bearer ${input.jwt}`,
      },
    }
  );

  return resp.data;
};

export const requestDeleteUser = async (httpClient: AxiosInstance) => {
  const resp = await httpClient.post<{
    email: string;
  }>(`${API_URL}/user/request-delete`);

  return resp.data;
};

export const confirmationDeleteUser = async (
  httpClient: AxiosInstance,
  token: string
) => {
  const response = await httpClient.get(
    `${API_URL}/user/confirmation-delete/${token}`
  );
  return response.data;
};
