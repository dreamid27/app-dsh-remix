import { IUser } from "../model/authModel";
import { IPlatformInfo } from "../model/platformInfo";

export let isPlatformReady = false;

export enum flutterHandler {
  HANDLE_SNACKBAR = "HANDLE_SNACKBAR",
  HANDLE_AFTER_LOGIN = "HANDLE_AFTER_LOGIN",
  HANDLE_AFTER_LOGOUT = "HANDLE_AFTER_LOGOUT",
  HANDLE_INFO = "HANDLE_INFO",
  HANDLE_DOWNLOAD_BLOB = "HANDLE_DOWNLOAD_BLOB",
  HANDLE_SIGN_IN_APPLE = "HANDLE_SIGN_IN_APPLE",
}

export function checkIsInAppWebView() {
  const flutterInAppWebView = window?.flutter_inappwebview;
  return !!flutterInAppWebView;
}

export function checkPlatformReady() {
  const platformReadyPromise = new Promise((resolve, reject) => {
    if (!window.flutter_inappready) {
      window.addEventListener("flutterInAppWebViewPlatformReady", () => {
        window.flutter_inappready = true;
        resolve(true);
      });
    } else {
      resolve(true);
    }
  });

  // Create a timeout promise that rejects after the specified timeout
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      window.flutter_inappready = true;
      resolve(true);
    }, 3000);
  });

  // Use Promise.race to race the platformReadyPromise with the timeoutPromise
  return Promise.race([platformReadyPromise, timeoutPromise]);
}

export async function flutterHandleLogin(user: IUser) {
  const flutterInAppWebView = window?.flutter_inappwebview;

  if (flutterInAppWebView) {
    await checkPlatformReady();
    flutterInAppWebView.callHandler(
      flutterHandler.HANDLE_AFTER_LOGIN,
      ...[user]
    );
  }
}

export async function flutterHandleLogout() {
  const flutterInAppWebView = window?.flutter_inappwebview;

  if (flutterInAppWebView) {
    await checkPlatformReady();
    flutterInAppWebView.callHandler(flutterHandler.HANDLE_AFTER_LOGOUT);
  }
}

export async function flutterHandleSnackbar(message: string) {
  const flutterInAppWebView = window?.flutter_inappwebview;

  if (flutterInAppWebView) {
    await checkPlatformReady();
    const args = [message];
    flutterInAppWebView.callHandler(flutterHandler.HANDLE_SNACKBAR, ...args);
  }
}

export async function flutterHandleGetInfo() {
  const flutterInAppWebView = window?.flutter_inappwebview;

  if (flutterInAppWebView) {
    await checkPlatformReady();
    const resp: IPlatformInfo = await flutterInAppWebView.callHandler(
      flutterHandler.HANDLE_INFO
    );

    return resp;
  }
}

export async function flutterHandleAppleSignIn() {
  const flutterInAppWebView = window?.flutter_inappwebview;

  if (flutterInAppWebView) {
    await checkPlatformReady();
    const resp: {
      token: string;
      is_error: boolean;
      error_message: string;
    } = await flutterInAppWebView.callHandler(
      flutterHandler.HANDLE_SIGN_IN_APPLE
    );

    return resp;
  }
}

export async function flutterHandleDownloadBlob({
  base64,
  fileName,
}: {
  base64: string;
  fileName: string;
}) {
  const flutterInAppWebView = window?.flutter_inappwebview;

  if (flutterInAppWebView) {
    await checkPlatformReady();
    const args = [base64, fileName];
    const resp: IPlatformInfo = await flutterInAppWebView.callHandler(
      flutterHandler.HANDLE_DOWNLOAD_BLOB,
      ...args
    );

    return resp;
  }
}
