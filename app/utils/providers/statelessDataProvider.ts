import axios from "axios";

// For Public API only (tidak ada Auth Bearer)
let statelessInstance = axios.create({
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

export default statelessInstance;
