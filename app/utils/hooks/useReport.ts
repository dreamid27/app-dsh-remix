import { useOutletContext } from "../contexts/outletContext";
import httpClient from "utils/providers/dataProvider";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ReportRilisType } from "../constants/report_type";
import { getCombinationReport, ICombinationReport } from "services/report";

const useReport = () => {
  const { selectedOutlet } = useOutletContext();
  const [reportReleases, setReportReleases] = useState<ICombinationReport[]>();
  const [reportHasWorkpapers, setReportHasWorkpapers] =
    useState<ICombinationReport[]>();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["reportData", selectedOutlet?.telegram_chat_id],
    enabled: !!selectedOutlet?.telegram_chat_id,
    queryFn: () =>
      getCombinationReport(httpClient, {
        group_ids: selectedOutlet?.telegram_chat_id || "",
        has_coa: true,
        sort_by: "report_period",
        sort_type: "desc",
        report_types: [
          ReportRilisType.FULL_MANAGER,
          ReportRilisType.FULL_ASSISTANT,
          ReportRilisType.PARTIAL,
        ],
      }),
  });

  useEffect(() => {
    if (data) {
      setReportReleases(data.filter((d) => d.has_report_releases) || []);
      setReportHasWorkpapers(data.filter((d) => d.has_workpaper) || []);
    }
  }, [data]);

  return {
    report: data,
    reportHasWorkpaper: reportHasWorkpapers,
    reportReleases: reportReleases,
    isFetching,
    refetch,
  };
};

export default useReport;
