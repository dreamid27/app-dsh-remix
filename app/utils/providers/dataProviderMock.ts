import axios from "axios";
import { getCookie } from "cookies-next";
import { TokenUserCookies } from "../constants/cookies";

const tokenUser = getCookie(TokenUserCookies) as string;

let instanceMock = axios.create({
  headers: { Authorization: `Bearer ${tokenUser}`, "X-App-Id": "app.delegasi" },
  paramsSerializer: function handleQuery(query) {
    return Object.entries(query)
      .map(([key, value], i) =>
        Array.isArray(value)
          ? `${key}=${value.join("&" + key + "=")}`
          : `${key}=${value}`
      )
      .join("&");
  },
});

export default instanceMock;
