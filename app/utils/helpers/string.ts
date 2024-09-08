import { string } from "yup/lib/locale";

export const getFirstWord = (str: string) => {
  if (!str) return "";
  const tempStr = str.split(" ");
  return tempStr[0] || "";
};

export const capitalizeWord = (str: string) => {
  if (!str) return "";
  const normalizedStr = str.replace(/_/g, " "); // mengganti _ dengan spasi
  const arr = normalizedStr.toLowerCase().split(" ");

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  const str2 = arr.join(" ");
  return str2;
};

export const capitalizeBrand = (str: string) => {
  if (!str) return "";
  const arr = str.toLowerCase().split(" ");

  if (arr.length > 1) return capitalizeWord(str);
  if (str.length <= 3) return str.toUpperCase();

  return capitalizeWord(str);
};

export const capitalizeAll = (str: string) => {
  if (!str) return "";
  return str.toUpperCase();
};

export const eliminateRegionCode = (str: string) => {
  if (!str) return "";
  const arr = str.toString().substring(0, 2);
  if (arr === "62") return str.toString().substring(2, str.length);

  return str;
};

export const eliminateDoubleRegion = (str: string) => {
  if (!str) return "";

  const arr = str.toString().substring(0, 4);
  if (arr === "6262") return str.toString().substring(2, str.length);
  return str;
};

export const addRegionCode = (str: string) => {
  if (!str) return "";
  const arr = str.toString().replace(/^08/, "628");
  return arr;
};

export const getInitialName = (str: string) => {
  if (!str) return "A";

  return str.toString().substr(0, 1);
};

export const get2InitialName = (str: string) => {
  // Split the full name into an array of names
  const namesArray = str.split(" ");
  // Get the initials by taking the first letter of each name
  const initials = namesArray
    .filter((_, i) => i <= 1)
    .map((name) => name[0])
    .join("");
  return initials;
};

export const convertCurrencyToNumber = (str: string) => {
  if (!str) return "";

  return str.replace(/[^0-9.-]+/g, "");
};

export const isUrl = (url: string) => {
  const regex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return regex.test(url);
};

export const sliceString = (str: string, length: number) => {
  if (!str) return "";
  return `${str.slice(0, length)}${str.length > length ? "..." : ""}`;
};

export const lowerCase = (str: string) => {
  if (!str) return str;
  return str.toLowerCase();
};

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const capitalizeText = (str: string) => {
  if (!str) return "";
  const normalizedStr = str.replace(/_/g, " "); // mengganti _ dengan spasi
  const arr = normalizedStr.toLowerCase().split(" ");

  if (arr.length > 1) return capitalizeWord(str);
  if (str.length <= 3) return str.toUpperCase();

  let brand = capitalizeWord(str);
  return brand;
};
