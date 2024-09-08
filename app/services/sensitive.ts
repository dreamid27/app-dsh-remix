import axios from "axios";
import { TypeUpload } from "utils/constants/typeUpload";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

interface ISetup {
  uid?: number | string;
  gid?: string;
  files: File[];
  uploadedBy: string | null;
  type: TypeUpload;
}

export const postSensitiveFiles = ({
  uid,
  gid,
  files,
  uploadedBy,
  type,
}: ISetup) => {
  let formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  if (uploadedBy) {
    formData.append("uploaded_by", uploadedBy);
  }

  const resp = axios.post(
    `${API_URL}/data/sensitive?uid=${uid}&gid=${gid}&type=${type}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return resp;
};
