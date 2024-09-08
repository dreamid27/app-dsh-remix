import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as renderTesting } from "@testing-library/react";
import { OutletContext } from "utils/contexts/outletContext";
import { ReportContext } from "utils/contexts/reportContext";
import { ICombinationReport } from "services/report";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { vi } from "vitest";
import { IOutlet } from "utils/model/authModel";

const queryClient = new QueryClient();

export const selectedOutlet: IOutlet = {
  customer_id: "85845bcd-ded7-4a42-848f-36dc3cb0cf1c",
  customer_name: "Dummy Delegasi",
  outlet_name: "DemoDel x Delegasi",
  telegram_chat_id: "-1001745048540",
  active_chat_id: "-1001745048540",
  user_role: "owner",
  chat_url:
    "tg://openmessage?user_id=9b8a2fef-1828-4a33-aac5-ae7a852cea58&chat_id=-1001745048540",
  email: "dummydel@delegasi.biz",
  last_recorded_date: "2024-06-24",
  last_income_record_Date: "2024-06-24",
  last_expense_record_date: "2023-12-19",
  total_processed_note: 0,
  total_note: 1,
  withdrawal_bank_account_id: "",
  last_upload_date: "2024-06-24",
  task_count: 12,
  is_kyb: true,
  is_payment_in_active: true,
  business: {
    phone: "081910373275",
    address: "Jalan Cigadung raya barat, kota bandung, jawa barat",
    category: "Industri",
    city: "Bandung",
    province: "Jawa Barat",
    email: "admin.dev@delegasi.co",
    logo: "https://oqsciowrtfycnsumxhdg.supabase.co/storage/v1/object/public/logo_customer/dde4d8a3-9a94-45b5-8785-ae2e16867684_logo_-1001745048540.png",
  },
};

export const reportHasWorkpaper: ICombinationReport[] = [
  {
    period: "2024-06",
    formatted_period: "JUN - 2024",
    group_id: "-1001745048540",
    has_report_releases: false,
    has_workpaper: true,
    report: null,
    workpaper: {
      id: "a295e88b-bbec-44cc-8fe3-922652b45472",
      created_at: "2024-06-19T07:14:27.443Z",
      updated_at: "2024-06-24T07:45:22.586Z",
      created_by: "faris@delegasi.co",
      updated_by: "admin@delegasi.co",
      period: "2024-06",
      customer_id: "85845bcd-ded7-4a42-848f-36dc3cb0cf1c",
      customer_name: "Dummy Delegasi",
      group_id: "-1001745048540",
      group_name: "DemoDel x Delegasi",
      status: "not_complete",
      format_date: "MM/DD/YYYY",
      last_sync: null,
    },
  },
  {
    period: "2024-05",
    formatted_period: "MEI - 2024",
    group_id: "-1001745048540",
    has_report_releases: false,
    has_workpaper: true,
    report: null,
    workpaper: {
      id: "9b713c43-048b-4127-b4c8-5e75e70a387b",
      created_at: "2024-05-08T04:57:50.783Z",
      updated_at: "2024-05-21T01:55:47.136Z",

      created_by: "faris@delegasi.co",
      updated_by: "faris@delegasi.co",
      period: "2024-04",
      customer_id: "85845bcd-ded7-4a42-848f-36dc3cb0cf1c",
      customer_name: "Dummy Delegasi",
      group_id: "-1001745048540",
      document_url:
        "https://docs.google.com/spreadsheets/d/1t7JKf65m4opHJ8ITLc0255NPJoW-SNF6_6_A5LR7irE",
      group_name: "DemoDel x Delegasi",
      status: "not_complete",
      format_date: "MM/DD/YYYY",
      last_sync: "2024-05-21T01:55:47.137Z",
    },
  },
  {
    period: "2024-03",
    formatted_period: "MAR - 2024",
    group_id: "-1001745048540",
    has_report_releases: false,
    has_workpaper: true,
    report: null,
    workpaper: {
      id: "ee2632cd-fdf4-4ab1-8c1a-77bf2339a3f6",
      created_at: "2024-04-05T04:04:18.303Z",
      updated_at: "2024-04-05T04:04:18.267Z",
      created_by: "muh.alfaris@gmail.com",
      updated_by: "faris@delegasi.co",
      period: "2024-03",
      customer_id: "85845bcd-ded7-4a42-848f-36dc3cb0cf1c",
      customer_name: "Dummy Delegasi",
      group_id: "-1001745048540",
      document_url:
        "https://docs.google.com/spreadsheets/d/1tSMBOTWQ2aAWD36GWiyH5qpjduO4Hnk0mdpvwD6Ppxw",
      group_name: "DemoDel x Delegasi",
      status: "not_complete",
      format_date: "MM/DD/YYYY",
      last_sync: null,
    },
  },
];

const render = (children: React.ReactNode) => {
  return renderTesting(
    <QueryClientProvider client={queryClient}>
      <OutletContext.Provider
        value={{
          isFetched: false,
          isLoading: false,
          isOpenDrawer: false,
          onOpenDrawer: vi.fn,
          onCloseDrawer: vi.fn,
          selectedOutlet: selectedOutlet,
          onSelectedOutlet: vi.fn,
          onFetchCompanyData: vi.fn,
          outletList: [],
          isHasMultiOutlet: false,
          integrations: [],
          toDo: null,
        }}
      >
        <ReportContext.Provider
          value={{
            isFetching: false,
            refetch: vi.fn,
            report: [],
            reportReleases: [],
            reportHasWorkpaper,
          }}
        >
          {children}
        </ReportContext.Provider>
      </OutletContext.Provider>
    </QueryClientProvider>,
    { wrapper: MemoryRouterProvider }
  );
};

export default render;
