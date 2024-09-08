import { createContext, useContext } from "react";
import { ICombinationReport } from "services/report";
import useReport from "../hooks/useReport";

interface IReportContext {
  isFetching: boolean;
  refetch: () => void;
  report: ICombinationReport[] | undefined;
  reportHasWorkpaper: ICombinationReport[] | undefined;
  reportReleases: ICombinationReport[] | undefined;
}

type ReportProps = {
  children: React.ReactNode;
};

export const ReportContext = createContext<IReportContext | null>(null);
export const ReportProvider = ({ children }: ReportProps) => {
  const obj = useReport();

  return (
    <ReportContext.Provider value={obj}>{children}</ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const reportCtx = useContext(ReportContext);
  if (!reportCtx) {
    throw new Error("Something error with reportContext");
  }
  return reportCtx;
};
