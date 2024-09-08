import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

interface ISetup {
  uid?: number | string;
  gid?: string;
  files: any;
}

export const postDataRecipes = async ({ uid, gid, files }: ISetup) => {
  let formData = new FormData();
  formData.append("files", files[0], "template_resep.xlsx");

  const resp = await axios.post(
    `${API_URL}/data/recipes?uid=${uid}&gid=${gid}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return resp;
};

export const postDataOnboarding = async ({ uid, gid, files }: ISetup) => {
  let formData = new FormData();
  formData.append("files", files[0], "template_data_onboarding.xlsx");

  const resp = await axios.post(
    `${API_URL}/data/onboarding?uid=${uid}&gid=${gid}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return resp;
};
