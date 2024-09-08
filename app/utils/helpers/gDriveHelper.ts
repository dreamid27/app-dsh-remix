export const getIDFromURL = (url: string) => {
  if (url) return url.split("/")[5].split(".")[0];
  return "";
};
