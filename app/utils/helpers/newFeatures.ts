import { format } from "date-fns";
import { FORMAT_SAVE_DATE } from "../constants/date";

export const isNewFeature = (expiredDate: string): boolean =>
  format(new Date(), FORMAT_SAVE_DATE) < expiredDate;
