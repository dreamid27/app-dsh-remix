import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { VersionAppCookies } from "utils/constants/cookies";
import useGlobalStore from "utils/store/globalStore";

const useCheckVersion = ({
  versionAppServer,
}: {
  versionAppServer: string;
}) => {
  const { versionApp } = useGlobalStore();

  return {
    isNewHome: versionApp === 2 || versionAppServer === "2" ? true : false,
  };
};

export default useCheckVersion;
