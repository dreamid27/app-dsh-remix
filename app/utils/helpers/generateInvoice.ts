import { format } from "date-fns";
import generateRandomChars from "./generateRandomChar";

export const generateInvoice = () => {
  return `INV/${format(new Date(), "yyyyMM")}/${generateRandomChars(
    4
  )}/${format(new Date(), "ss")}/${format(new Date(), "mm")}`;
};
