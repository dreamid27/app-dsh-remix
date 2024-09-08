import { AxiosInstance } from "axios";
import { format } from "date-fns";
import fileDownload from "js-file-download";
import {
  checkIsInAppWebView,
  flutterHandleDownloadBlob,
} from "utils/constants/flutter_handler";
import { ReportRilisType } from "utils/constants/report_type";
import { RowTypes } from "components/molecules/comparisonTable";
import { id } from "date-fns/locale";
import { capitalizeWord } from "utils/helpers/string";
import { getTransactionPeriod } from "./transactions";
import {
  IExpense,
  IItem,
  IItemHighlight,
  IPerfomanceWeek,
  IReportItem,
} from "containers/report/interface/report.interface";
import { ComparisonType } from "containers/report/constants";

export interface IReportComparison {
  categories: string[];
  conclusion_notes: string[];
  data: IComparisonDetail[];
}

export interface IComparisonDetail {
  name: string;
  key: string;
  data: number[];
}

export interface IInsight {
  status: string;
  type: string;
  url: string;
  period: string;
}

export interface IReportParams {
  page?: string;
  group_ids?: string;
  has_coa?: boolean;
  report_types?: string[];
  sort_type?: string;
  sort_by?: string;
}

export interface ICombinationReport {
  period: string;
  formatted_period: string;
  group_id: string;
  has_report_releases: boolean;
  has_workpaper: boolean;
  report?: IReport | null;
  workpaper?: IWorkpaper | null;
}

export interface ItemValue {
  month: string;
  formatted_month: string;
  value: number;
  formatted_value: string;
}

export interface IReportDetail {
  label: string;
  values: ItemValue[];
  details: IReportDetail[];
  category: RowTypes;
}

export interface ITopOperational {
  account_name: string;
  balance_changes: number;
  prev_balance_changes: number;
  amount_change_with_prev: number;
  percentage_change_with_prev: number;
}

export interface IInsightReport {
  top_operational: ITopOperational[];
  top_amount_change_operational: ITopOperational[];
  top_percentage_change_operational: ITopOperational[];
}

export interface IWorkpaper {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  created_by: string;
  updated_by: string;
  deleted_by?: string;
  period: string;
  customer_id: string;
  customer_name: string;
  group_id: string;
  document_url?: string;
  group_name: string;
  status: string;
  format_date: string;
  last_sync: any;
}

export interface IReport {
  id: number;
  created_at: string;
  company_id: string;
  report_type: string;
  report_period: string;
  report_url?: string;
  report_status:string;
  uploaded_by: string;
  updated_at?: string;
  disclaimer: string;
  highlights: string;
  formatted_period: string;
  formatted_highlights: string[];
}

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_ACC_API || "";
const BO_API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export interface IReportInsightParams {
  period: string;
  group_id: string;
}

export interface ICombinationReportWrapper {
  period: string;
  report: ICombinationReport;
}

export interface IReportDetailParams {
  group_id: string;
  period: string;
  group_name: string;
}

export interface IReportPeriodParams {
  uid?: number | string;
  groupId?: string;
  isFlagging?: boolean;
}

export interface IReportLinkParams {
  period: string;
  groupId: string;
}


export const getReport = async (
  httpClient: AxiosInstance,
  params: IReportParams
) => {
  const res = await httpClient.get<IReport[]>(`${API_URL}/v1/report`, {
    params: params,
  });
  const reports = res.data || [];

  /* filtered when the report in same period with different type, it prevent data report double in same period */
  const filteredReport = reports.filter((rep: any) => {
    const isPartial = rep.report_type === ReportRilisType.PARTIAL;

    if (isPartial) {
      const isExist = reports.find(
        (d: any) =>
          d.report_type !== ReportRilisType.PARTIAL &&
          d.report_period === rep.period
      );
      if (isExist) return false;
    }
    return true;
  });

  return filteredReport;
};

export const getReportPeriod = async (
  httpClient: AxiosInstance,
  params: IReportPeriodParams
) => {
  // Get report data from API
  const resp = await httpClient.get(
    `${BO_API_URL}/reports?uid=${params.uid}&gid=${params.groupId}`
  );

  // Get reports from response data or set to empty array if not present
  const dataReport = resp?.data?.reports || [];

  // Get additional report data from API
  const respReport = await getReport(httpClient, {
    group_ids: params.groupId,
    has_coa: true,
    sort_by: "report_period",
    sort_type: "desc",
    report_types: [
      ReportRilisType.FULL_MANAGER,
      ReportRilisType.FULL_ASSISTANT,
      ReportRilisType.PARTIAL,
    ],
  });

  /**
   * Checks if a report period has daily or summary data available
   * @param period - Report period to check
   * @returns True if daily or summary data is available, false otherwise
   */
  const isHasDailyOrSummary = (period: string) => {
    return (
      !!respReport.find((obj: any) => obj.report_period === period) ||
      !!respTransactionPeriod.find((obj: any) => obj.period === period)
    );
  };

  /**
   * Checks if a report exists for a given period
   * @param period - Report period to check
   * @returns True if a report exists for the given period, false otherwise
   */
  const hasReport = (period: string) => {
    return dataReport.find((d: any) => d.period === period);
  };

  // Get transaction period data from API
  const respTransactionPeriod = await getTransactionPeriod(
    httpClient,
    params.groupId || ""
  );

  // Filter transaction period data to only include periods without reports
  const dataTransactionNeedIncluded = respTransactionPeriod.filter(
    (d: any) => !hasReport(d.period)
  );

  if (params.isFlagging) {
    // Add transaction data to report data
    dataTransactionNeedIncluded.forEach((d: any) => {
      dataReport.push({
        label: "Laporan",
        subLabel: `${format(new Date(d.period), "'Periode Bulan' MMMM yyyy", {
          locale: id,
        })}`,
        link: `/report/detail?period=${d.period}&source=archive`,

        type: "transaction",
        period: d.period,
      });
    });
  }

  // Normalize report data for display
  const normalizerReport = dataReport
    .map((obj: IInsight) => ({
      label: `Laporan ${capitalizeWord(obj.type)}`,
      subLabel: `${format(new Date(obj.period), "'Periode Bulan' MMMM yyyy", {
        locale: id,
      })}`,
      link: `${isHasDailyOrSummary(obj.period) && params.isFlagging
          ? `/report/detail?period=${obj.period}&source=archive`
          : obj.url
        } `,

      type: obj.type,
      status: obj.status,
      period: obj.period,
    }))
    .sort((a: any, b: any) => {
      if (a.period < b.period) return 1;
      if (a.period > b.period) return -1;
      return 0;
    });

  return normalizerReport;
};

export const getWorkpaper = async (
  httpClient: AxiosInstance,
  group_id: string
) => {
  return httpClient
    .get<IWorkpaper[]>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/workpaper`,
      {
        params: {
          group_ids: [group_id],
        },
      }
    )
    .then((res) => res.data);
};

export const getCombinationReport = async (
  httpClient: AxiosInstance,
  params: IReportParams
): Promise<ICombinationReport[]> => {
  const reports = await getReport(httpClient, params);
  const workpapers = await getWorkpaper(httpClient, params.group_ids || "");

  const mappedReport: ICombinationReport[] = [];
  while (reports.length > 0 || workpapers.length > 0) {
    const report = reports[0];
    const workpaper = workpapers[0];

    if (report && workpaper) {
      const samePeriod = report?.report_period === workpaper?.period;
      const hasReport = report?.report_period > workpaper?.period || samePeriod;
      const hasWorkpaper =
        workpaper?.period > report?.report_period || samePeriod;

      const modelReport: ICombinationReport = {
        period: hasReport ? report.report_period : workpaper.period,
        formatted_period: format(
          new Date(hasReport ? report.report_period : workpaper.period),
          "MMM - yyyy"
        ).toUpperCase(),
        group_id: report.company_id || workpaper.group_id,
        has_report_releases: hasReport,
        has_workpaper: hasWorkpaper,
        report: hasReport ? report : null,
        workpaper: hasWorkpaper ? workpaper : null,
      };
      mappedReport.push(modelReport);
      if (samePeriod) {
        reports.shift();
        workpapers.shift();
      } else if (hasReport) {
        reports.shift();
      } else {
        workpapers.shift();
      }
    } else if (report) {
      const modelReport: ICombinationReport = {
        period: report.report_period,
        formatted_period: format(
          new Date(report.report_period),
          "MMM - yyyy"
        ).toUpperCase(),
        group_id: report.company_id,
        has_report_releases: true,
        has_workpaper: false,
        report: report,
        workpaper: null,
      };
      mappedReport.push(modelReport);
      reports.shift();
    } else if (workpaper) {
      const modelReport: ICombinationReport = {
        period: workpaper.period,
        formatted_period: format(
          new Date(workpaper.period),
          "MMM - yyyy"
        ).toUpperCase(),
        group_id: workpaper.group_id,
        has_report_releases: false,
        has_workpaper: true,
        report: null,
        workpaper: workpaper,
      };
      mappedReport.push(modelReport);
      workpapers.shift();
    }
  }

  return mappedReport;
};

export const getReportDetail = async (
  httpClient: AxiosInstance,
  type: string,
  params: IReportDetailParams
) => {
  return httpClient
    .get<IReportDetail[]>(`${API_URL}/v1/report/detail/${type}`, {
      params,
    })
    .then((res) => res.data);
};

export const downloadReportDetail = async (
  httpClient: AxiosInstance,
  type: string,
  params: IReportDetailParams
) => {
  return httpClient
    .get(`${API_URL}/v1/report/detail/${type}/download-csv`, {
      params,
    })
    .then((res) => {
      const fileName = `${params.group_name}_${type}_${params.period}.csv`;
      if (checkIsInAppWebView()) {
        // Convert the content to base64
        const base64Content = window.btoa(res.data);
        flutterHandleDownloadBlob({
          base64: base64Content,
          fileName,
        });
      } else {
        fileDownload(res.data, fileName);
      }
    });
};

export const getInsightReport = async (
  httpClient: AxiosInstance,
  params: IReportInsightParams
) => {
  const res = await httpClient.get<IInsightReport>(
    `${API_URL}/v1/report/insight`,
    { params }
  );
  return res.data;
};

export const getPerformanceWeekly = async (
  httpClient: AxiosInstance,
  {
    group_id,
    period,
  }: {
    group_id: string;
    period?: string;
  }
) => {
  return httpClient
    .get<IPerfomanceWeek>(`${API_URL}/v1/report/performance-weekly`, {
      params: {
        group_id: group_id,
        period,
      },
    })
    .then((res) => res.data);
};

export const getReportRecapPDF = async (
  httpClient: AxiosInstance,
  {
    group_id,
    period,
    is_download,
  }: {
    group_id: string;
    period?: string;
    is_download?: boolean;
  }
) => {
  const res = await httpClient.get<Blob>(`${API_URL}/v1/report/temporary/pdf`, {
    params: {
      group_id: group_id,
      period,
    },
    responseType: "blob",
  });

  return res.data;
};

export const getComparisonHighlight = async (
  httpClient: AxiosInstance,
  {
    group_id,
    period,
  }: {
    group_id: string;
    period?: string;
  }
) => {
  return httpClient
    .get<IReportItem<IItemHighlight>>(
      `${API_URL}/v1/report/comparison/highlight`,
      {
        params: {
          group_id: group_id,
          period,
        },
      }
    )
    .then((res) => res.data);
};

export const getReportExpenses = async (
  httpClient: AxiosInstance,
  {
    group_id,
    period,
  }: {
    group_id: string;
    period?: string;
  }
) => {
  return httpClient
    .get<IReportItem<IExpense>>(`${API_URL}/v1/report/comparison/expenses`, {
      params: {
        group_id: group_id,
        period,
      },
    })
    .then((res) => res.data);
};

export const getReportItems = async (
  httpClient: AxiosInstance,
  {
    group_id,
    period,
  }: {
    group_id: string;
    period?: string;
  }
) => {
  return httpClient
    .get<IReportItem<IItem>>(`${API_URL}/v1/report/comparison/items`, {
      params: {
        group_id: group_id,
        period,
      },
    })
    .then((res) => res.data);
};

export const getReportComparison = async (
  httpClient: AxiosInstance,
  {
    type,
    group_id,
    period,
  }: {
    type: ComparisonType;
    group_id: string;
    period?: string;
  }
) => {
  return httpClient
    .get<IReportComparison>(`${API_URL}/v1/report/comparison/${type}`, {
      params: {
        group_id: group_id,
        period,
      },
    })
    .then((res) => res.data);
};

export const downloadRecapPdf = async (
  { file, base64String }: { file: Uint8Array; base64String: string },
  {
    period,
  }: {
    period?: string;
  }
) => {
  const fileName = `LaporanRekap_${period}_${format(
    new Date(),
    "ddMMMyyyy"
  )}.pdf`;

  if (checkIsInAppWebView()) {
    flutterHandleDownloadBlob({
      base64: base64String as string,
      fileName,
    });
  } else {
    fileDownload(file, fileName);
  }
};

export const generateReportLink = async (
  httpClient: AxiosInstance,
  params: IReportLinkParams
) => {
  const res = await httpClient.get<{ data: { link: string } }>(`${BO_API_URL}/reports/generate-link`, {
    params: params,
  });

  const link = res?.data?.data.link;

  return link
}
