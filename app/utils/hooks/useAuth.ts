import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";
import {
  IsTestingCookies,
  OutletSelectedCookies,
  SelfRegistrationCookies,
  TelegramUserCookies,
  TokenUserCookies,
} from "../constants/cookies";
import { IRequestAuth, IUser } from "../model/authModel";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { PAGE_PATH } from "../constants/route";
import posthog from "posthog-js";
import { getRequestToken, login, loginV2 } from "../../services/auth";
import { VISIT_APP, trackingLogoutSubmit } from "../tracking";
import { AxiosError } from "axios";
import {
  flutterHandleGetInfo,
  flutterHandleLogin,
  flutterHandleLogout,
} from "../constants/flutter_handler";
import { IPlatformInfo } from "../model/platformInfo";

import * as Sentry from "@sentry/browser";
import { eventPosthog } from "../helpers/eventTrack";
import { useQuery } from "@tanstack/react-query";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  APP_PAYMENT_LINK_DEMO,
  RECEIVABLE_FEATURE_FLAG,
  SELF_REGISTER,
} from "utils/constants/flag";
import { ACCESS_FEATURES } from "utils/constants/accessFeature";
import {
  getMe,
  removeAllPushNotifToken,
  upsertAllPushNotifToken,
} from "services/users";

interface IErrorJWT {
  message: string;
  name: string;
  expiredAt: Date;
}

interface IErrorLoginResp {
  error: string;
}

const id = "toast-login";

const DUMMY_USER = {
  authDate: 1673355104,
  id: 744425672,
  companyName: "",
  telegramChatId: "",
  integrationAuth: { gobiz: false },
  firstName: "Admin",
  hash: "8da9350ea49a26692e8736fee132df2ab222c4cc08b526cb82237eecc9f686da",
  lastName: "Delegasi",
  username: "halan278",
  chatUrl: "",
  userRole: "",
  outlets: [],
  email: `dummy_user@delegasi.co`,
};

const useAuth = () => {
  const router = useRouter();
  const toast = useToast();
  const [loginTry, setLoginTry] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [platformInfo, setPlatformInfo] = useState<IPlatformInfo>();
  const [isLoginProgress, setLoginProgress] = useState(false);

  const tokenCookies = (getCookie(TokenUserCookies) as string) || "";

  const [isSelfRegister, setIsSelfRegister] = useState(false);

  const selfRegisterCookies = getCookie(SelfRegistrationCookies);
  const isTestingCookies = getCookie(IsTestingCookies);
  const selfRegisterFlags = useFeatureFlagEnabled(SELF_REGISTER);

  const paymentLinkDemo = useFeatureFlagEnabled(APP_PAYMENT_LINK_DEMO);

  useEffect(() => {
    if (selfRegisterFlags || selfRegisterCookies || isTestingCookies) {
      setIsSelfRegister(true);
    }
  }, [selfRegisterFlags, selfRegisterCookies, isTestingCookies]);

  //when payment link demo is enable,set window.label_payment_link to "Payment Link"
  useEffect(() => {
    if (paymentLinkDemo) {
      //adding to localstorage
      localStorage.setItem("useInvoiceText", "true");
    } else {
      localStorage.removeItem("useInvoiceText");
    }
  }, [paymentLinkDemo]);

  //Flag AR
  const receivableFlag = useFeatureFlagEnabled(RECEIVABLE_FEATURE_FLAG);
  const paymentLinkDemoFlag = useFeatureFlagEnabled(APP_PAYMENT_LINK_DEMO);
  console.log(paymentLinkDemo, "payment demo");

  const {
    data: profile,
    isLoading: isLoadingUser,
    isSuccess: isSuccessLogin,
    isError: isErrorLogin,
    error: errorLogin,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["userProfile", tokenCookies],
    enabled: !!tokenCookies,
    queryFn: () => getMe(tokenCookies),
  });

  const handleLoginV2 = async (requestAuth: IRequestAuth) => {
    try {
      if (!isLoginProgress) {
        setLoginProgress(true);
        const requestToken = await getRequestToken(requestAuth);
        const res = isSelfRegister
          ? await loginV2(requestToken)
          : await login(requestToken);

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        setCookie(TokenUserCookies, res.token, {
          expires: expirationDate,
        });

        if (!toast.isActive(id)) {
          toast({
            id,
            description: "Berhasil login",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }

        router.push("/");
        router.reload();
      }
    } catch (error) {
      throw error;
    } finally {
      setLoginProgress(false);
    }
  };

  const getUserV2 = async (isLogin?: boolean, token?: string) => {
    setLoginTry(isLogin || false);
    const userToken = tokenCookies || token;
    const tempPlatformInfo = await getPlatformInfo();

    const mappedPlatformInfo = tempPlatformInfo
      ? {
          platform_version: tempPlatformInfo?.version,
          platform_build_number: tempPlatformInfo?.build_number,
          platform_os: tempPlatformInfo?.platform || "web",
          onesignal_subscription_id:
            tempPlatformInfo?.onesignal_subscription_id,
          push_notif_token: tempPlatformInfo?.push_notif_token,
        }
      : {
          platform_os: "web",
        };

    if (!userToken) {
      posthog.capture("set_platform_info", {
        $set: { ...mappedPlatformInfo },
      });

      if (!!platformInfo?.push_notif_token) {
        upsertAllPushNotifToken({
          onesignal_token: platformInfo?.onesignal_subscription_id,
          firebase_token: platformInfo?.push_notif_token,
          user_id: null,
        });
      }

      return;
    }

    if (!profile) return;

    const user: IUser = {
      id: profile.id,
      name: profile.name,
      phoneNumber: profile.phone_number,
      lastName: profile.last_name,
      firstName: profile.first_name,
      telegramUserId: profile.telegram_user_id,
      companyName: profile.company_name,
      telegramChatId: profile.telegram_chat_id,
      chatUrl: profile.chat_url,
      userRole: profile.user_role,
      outlets: profile.outlets,
      customerId: profile.customer_id,
      customerName: profile.customer_name,
      customerActive: profile.customer_active,
      referrerCode: profile.referrer_code,
      isCustomer: !!profile.customer_id,
      platform_info: tempPlatformInfo || undefined,
      email: `${profile.id}@delegasi.co`,
      username: profile.username,
      photoUrl: profile.photo_url,
      isIncognito: profile.is_incognito || false,
      onboardingStatus: profile.onboarding_status,
      accessFeatures: {
        [ACCESS_FEATURES.AR]: receivableFlag || false,
        [ACCESS_FEATURES.CC_TRANSFER]:
          paymentLinkDemoFlag === true ? false : true,
      },
      userOnboarded: profile.user_onboarded,
    };

    if (!!tempPlatformInfo?.push_notif_token) {
      upsertAllPushNotifToken({
        jwt: userToken as string,
        onesignal_token: tempPlatformInfo.onesignal_subscription_id,
        firebase_token: tempPlatformInfo.push_notif_token,
        user_id: user.id,
      });
    }

    if (user.telegramChatId) {
      posthog.identify(`group:${user.telegramChatId}`, {
        group_name: user.companyName,
        from_user: user.id,
        from_name: `${user.firstName}${
          user?.lastName ? " " + user?.lastName || "" : ""
        }`,
        role: user.userRole,
        customer_id: user.customerId,
        customer_name: user.customerName,
        is_incognito: user.isIncognito,
        ...mappedPlatformInfo,
      });

      //handle track to native
      flutterHandleLogin(user);
    }

    if (profile) setUser(user);
    eventPosthog(VISIT_APP);
  };

  const handleLogout = async () => {
    const userToken = getCookie(TokenUserCookies);
    const tempPlatformInfo = await getPlatformInfo();

    removeAllPushNotifToken({
      jwt: userToken?.toString(),
      onesignal_token: tempPlatformInfo?.onesignal_subscription_id,
      firebase_token: tempPlatformInfo?.push_notif_token,
    });

    deleteCookie(TelegramUserCookies);
    deleteCookie(OutletSelectedCookies);
    deleteCookie(TokenUserCookies);
    posthog.reset(false);
    flutterHandleLogout();
    trackingLogoutSubmit();
    toast({
      description:
        "Anda berhasil logout, sebentar lagi anda akan diarahkan ke halaman utama",
      status: "warning",
      duration: 5000,
      isClosable: true,
    });

    setTimeout(() => {
      router.push("/");
      router.reload();
    }, 400);
  };

  const getPlatformInfo = async () => {
    const tempPlatformInfo = await flutterHandleGetInfo();
    setPlatformInfo(tempPlatformInfo);

    return tempPlatformInfo;
  };

  const isLogin = user !== null;

  const refreshUser = async () => {
    refetchUser();
  };

  useEffect(() => {
    getUserV2();
  }, []);

  const handleIncognito = async (token: string) => {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    setCookie(TokenUserCookies, token, {
      expires: expirationDate,
    });

    if (!toast.isActive(id)) {
      toast({
        id,
        description: "Berhasil incognito",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    window.location.href = "/";
  };

  useEffect(() => {
    getUserV2();
  }, [profile, receivableFlag]);

  useEffect(() => {
    if (isErrorLogin) {
      if (errorLogin instanceof AxiosError) {
        const responseData = errorLogin.response?.data;
        if (responseData?.error === "TOKEN_EXPIRED_INVALID") {
          deleteCookie(TokenUserCookies);
          router.push(PAGE_PATH.HOME);
          return;
        }
      }

      if (!loginTry) {
        toast({
          description: `Terjadi kesalahan, err: ${errorLogin}`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      Sentry.captureException(errorLogin);
      throw errorLogin;
    }
  }, [isErrorLogin, isSuccessLogin]);

  useEffect(() => {
    if (selfRegisterFlags) {
      setCookie(SelfRegistrationCookies, "1");
    }
  }, [selfRegisterFlags]);

  // isLoading: boolean;
  // isLoadingUser: boolean;
  // handleLoginV2: (response: any, isDummy?: boolean) => Promise<void>;
  // handleLogout: () => Promise<void>;
  // handleIncognito: (token: string) => Promise<void>;
  // refreshUser: () => Promise<void>;
  // isLogin: boolean;
  // user: IUser | null;
  // platformInfo: IPlatformInfo | undefined;
  // isSelfRegister?: boolean;
  return {
    isLoading: isLoadingUser,
    isLoadingUser: isLoadingUser,
    handleLogout,
    handleLoginV2,
    isLogin,
    user,
    platformInfo,
    refreshUser,
    handleIncognito,
    isSelfRegister,
  };
};

export default useAuth;
