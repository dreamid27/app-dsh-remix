import { createClient } from "@supabase/supabase-js";
import fileDownload from "js-file-download";
import { checkIsInAppWebView, flutterHandleDownloadBlob } from "utils/constants/flutter_handler";
import base64ToUint8Array from "utils/helpers/base64ToUint8Array";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_TOKEN || "";

const supabase = createClient(supabaseUrl, supabaseKey);

interface ILoginEmail {
  email: string;
  password: string;
}

export const loginEmailPassword = async (payload: ILoginEmail) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const retrievePublicFile = async (bucket: string, path: string): Promise<string> => {
  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path, {
      download: true,
    })

  const resp: string = await fetch(data.publicUrl).then((resp) => resp.blob()).then((resp) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(resp);
      reader.onloadend = function () {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = function () {
        reject(new Error("Error occurred while reading file."));
      };
    });
  });

  // Return as Base64 string
  return resp

}

export const extractUrl = (url: string) => {
  const parsedUrl = new URL(url);

  const splittedPath = parsedUrl.pathname.split("/");

  const folder = parsedUrl.pathname
    .split("/")
  [splittedPath.length - 2].replace(/%20/g, " ");

  const fileName =
    parsedUrl.pathname
      .split("/")
    [splittedPath.length - 1].replace(/%20/g, " ")

  const path = `${folder}/${fileName}`;

  return { path, fileName }
}

export const downloadPublicFile = async (bucket: string, path: string, fileName: string) => {
  try {

    const base64 = await retrievePublicFile(bucket, path);
    const file = base64ToUint8Array(base64 as string);
    const base64String = base64 as string;

    if (checkIsInAppWebView()) {
      flutterHandleDownloadBlob({
        base64: base64String as string,
        fileName,
      });
    } else {
      fileDownload(file, fileName);
    }
  } catch (e) {
    throw e
  }
}

export default supabase;
