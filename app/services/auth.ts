import axios, { AxiosInstance } from "axios";
import { IRequestAuth } from "../utils/model/authModel";
import getJsonwebtoken from "utils/helpers/jsonwebtoken";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export const getProfile = async (uid: number) => {
  try {
    // TODO: uncoment this line when API is ready
    const resp = await axios.get(`${API_URL}/profile/${uid}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export const getRequestToken = async (payload: IRequestAuth) => {
  try {
    const jwt = await getJsonwebtoken();
    // sign the payload to create a token
    const token = jwt.sign(payload, process.env.NEXT_PUBLIC_JWT_SIGN || "", {
      expiresIn: "10m",
    });

    return token;
  } catch (error) {
    throw new Error("Error creating token");
  }
};

export const login = async (token: string) => {
  const resp = await axios.post(`${API_URL}/auth/login`, {
    request_token: token,
  });

  return resp.data;
};

export const loginV2 = async (token: string) => {
  const resp = await axios.post(`${API_URL}/v2/auth/login`, {
    request_token: token,
  });

  return resp.data;
};

export const registerEmail = async (email: string, baseUrl?: string) => {
  const resp = await axios.post(
    `${API_URL}/auth/register/email`,
    {
      email,
    },
    {
      headers: {
        ...(baseUrl && { "x-app-url": baseUrl }),
      },
    }
  );

  return resp.data;
};

export const checkEmail = async (email: string) => {
  const resp = await axios.post<{
    is_registered: boolean;
    message: string;
  }>(`${API_URL}/auth/check-email`, {
    email,
  });

  return resp.data;
};

export const sendOtp = async (
  httpClient: AxiosInstance,
  phoneNumber: string
) => {
  const response = await httpClient.post(`${API_URL}/auth/otp/send`, {
    phone_number: phoneNumber,
    target_type: "whatsapp",
  });

  return response.data;
};

export const verifyOtp = async (
  httpClient: AxiosInstance,
  data: {
    phoneNumber: string;
    code: string;
  }
) => {
  const response = await httpClient.post(`${API_URL}/auth/otp/verify`, {
    phone_number: data.phoneNumber,
    code: data.code,
  });

  return response.data;
};
