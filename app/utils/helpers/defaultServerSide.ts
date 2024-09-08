import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { TokenUserCookies, VersionAppCookies } from "utils/constants/cookies";

export type PageProps = {
  isNewHome: boolean;
  isLogin: boolean;
  versionApp: string;
};

export const defaultServerSide: GetServerSideProps<PageProps> = async ({
  req,
  res,
}) => {
  const versionApp = "2";
  const userToken = getCookie(TokenUserCookies, { req, res }) || "";

  return {
    props: {
      isLogin: !!userToken,
      isNewHome: versionApp === "2" ? true : false,
      versionApp: versionApp as string,
    },
  };
};
