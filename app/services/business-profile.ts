import { AxiosInstance } from "axios";
import { ProfileBusiness } from "../containers/profile/model/profileBusiness";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export interface IPostProfileBusiness {
  data: ProfileBusiness;
  gid: string;
}

export const getProfileBusiness = async (
  httpClient: AxiosInstance,
  gid: string
) => {
  const response = await httpClient.get(
    `${API_URL}/business-profile?group_id=${gid}`
  );

  return response.data;
};

export const postProfileBusiness = async (
  httpClient: AxiosInstance,
  { gid, data }: IPostProfileBusiness
) => {
  // let mock = new MockAdapter(httpClient, { delayResponse: 1500 });
  // mock.onPatch(API_URL + `/accounts/${gid}`).reply(200, "success account");

  const response = await httpClient.patch(
    `${API_URL}/business-profile?group_id=${gid}`,
    data
  );
  return response.data;
};
