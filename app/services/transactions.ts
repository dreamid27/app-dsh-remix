import { AxiosInstance } from "axios";
import { IOtherBreakdown } from "components/organism/receivable/contants/interface";
import { DailyTransactionCategory } from "containers/home/constants";
import {
  CategoryTransaction,
  SortTypes,
  SortTypesItems,
} from "containers/transactions/constants";
import {
  ITransaction,
  ITransactionDetail,
  ITransactionIncomeDetail,
} from "containers/transactions/interfaces";
import { format } from "date-fns";
import fileDownload from "js-file-download";
import {
  checkIsInAppWebView,
  flutterHandleDownloadBlob,
} from "utils/constants/flutter_handler";
import { formatCurrency, formatNumber } from "utils/helpers/formatNumberHelper";
import {
  IAccountingTransaction,
  IAccountingTransactionIncome,
  ITransactionDetailResp,
} from "utils/interface/transaction";

export const getSort = (sort: SortTypes, category?: CategoryTransaction) => {
  switch (sort) {
    case SortTypes.HighestPrice:
      return {
        sort_by: category === CategoryTransaction.Income ? "amount" : "total",
        sort_type: "DESC",
      };

    case SortTypes.LowestPrice:
      return {
        sort_by: category === CategoryTransaction.Income ? "amount" : "total",
        sort_type: "ASC",
      };
    case SortTypes.QuantityAsc:
      return {
        sort_by: "qty",
        sort_type: "ASC",
      };
    case SortTypes.QuantityDesc:
      return {
        sort_by: "qty",
        sort_type: "DESC",
      };
    case SortTypes.DateAsc:
      return {
        sort_by: "date",
        sort_type: "ASC",
      };
    case SortTypes.DateDesc:
      return {
        sort_by: "date",
        sort_type: "DESC",
      };
    case SortTypes.Older:
      return {
        sort_by: "created_at",
        sort_type: "ASC",
      };
    case SortTypes.RemarkAsc:
      return {
        sort_by: "remark",
        sort_type: "ASC",
      };
    case SortTypes.RemarkDdesc:
      return {
        sort_by: "remark",
        sort_type: "DESC",
      };
    default:
      return {
        sort_by: "created_at",
        sort_type: "DESC",
      };
  }
};

const getSortExpenses = (sort: SortTypesItems) => {
  switch (sort) {
    case SortTypesItems.NameDesc:
      return {
        sort_by: "product_name",
        sort_type: "DESC",
      };

    case SortTypesItems.PriceAsc:
      return {
        sort_by: "total_price",
        sort_type: "ASC",
      };

    case SortTypesItems.PriceDesc:
      return {
        sort_by: "total_price",
        sort_type: "DESC",
      };
    case SortTypesItems.QuantityAsc:
      return {
        sort_by: "total_quantity",
        sort_type: "ASC",
      };
    case SortTypesItems.QuantityDesc:
      return {
        sort_by: "total_quantity",
        sort_type: "DESC",
      };
    case SortTypesItems.AccountNameAsc:
      return {
        sort_by: "account_name",
        sort_type: "ASC",
      };
    case SortTypesItems.AccountNameDesc:
      return {
        sort_by: "account_name",
        sort_type: "DESC",
      };
    default:
      return {
        sort_by: "product_name",
        sort_type: "ASC",
      };
  }
};

export enum ExpenseType {
  BILL = "bill",
  OTHER_TRANSACTION = "other_transaction",
  EXPENSE = "expense",
}

export enum FilterExpenseType {
  SOURCE_ACCOUNTS = "source_accounts",
  TRANSACTION_TYPES = "transaction_types",
  TRANSACTION_CATEGORIES = "transaction_categories",
}

export enum FilterIncomeType {
  CHANNELS = "channels",
  PAYMENT_METHODS = "payment_methods",
  STATUS = "status",
}

export interface IInsightParams {
  date_from: string;
  date_to: string;
  period_from?: string;
  period_to?: string;
  group_id: string;
  customer_id: string;
  transaction_categories?: string[];

  // income
  channels?: string[];
  status?: string[];
  payment_methods?: string[];

  // expense
  types?: string[];
  transaction_types?: string[];
  source_accounts?: string[];

  //others
  expense_account_names?: string[];
  income_account_names?: string[];
}

export interface IExpenseInsight {
  total_amount: number;
  total_count: string;
  total_amount_material: number;
  total_amount_marketing: number;
  total_amount_others: number;
  total_amount_operational: number;
  highest_date: {
    date: string;
    total_amount: number;
  };
  lowest_date: {
    date: string;
    total_amount: number;
  };
  count_date_with_transactions: number;
  last_transaction: Array<{
    date: string;
    total_amount: number;
    is_anomaly: boolean;
  }>;
  median_amount_group_by_date: number;
  top_items_amount_based?: Array<{
    name: string;
    total_amount: number;
  }> | null;
  top_items_count_based?: Array<{
    name: string;
    total_count: number;
  }> | null;
  top_expense_amount_based: Array<{
    name: string;
    total_amount: number;
  }>;
  anomalies: Array<{
    date: string;
    total_amount: number;
    is_anomaly: boolean;
  }>;
  average_daily?: number;
  group_by_source_account: {
    name: string;
    total_amount: number;
    total_count: number;
  }[];
  group_by_transaction_type: {
    name: string;
    total_amount: number;
    total_count: number;
  }[];
  group_by_transaction_category: {
    name: string;
    total_amount: number;
    total_count: number;
  }[];
}

export interface IIncomeInsight {
  revenue_amount: number | null;
  revenue_count: number | null;
  avg_total_amount: number | null;
  avg_count: number;
  total_amount: number | null;
  total_count: string;
  count_date_with_transactions: number;
  top_3_channel: Array<{
    channel: string;
    total_amount: number;
  }>;

  highest_date: {
    date: string;
    total_amount: number;
  } | null;
  lowest_date: {
    date: string;
    total_amount: number;
  } | null;
  median_amount_group_by_date: number | null;
  last_transaction: ILastTransaction[];
  group_by_status: {
    name: string;
    total_amount: number;
    total_count: number;
  }[];
  group_by_payment_method: {
    name: string;
    total_amount: number;
    total_count: number;
  }[];
  group_by_channel: {
    name: string;
    total_amount: number;
    total_count: number;
  }[];
  average_daily?: number;
  average_nominal?: number;
}

interface ILastTransaction {
  total_amount: number;
  date: string;
  is_anomaly: boolean;
}

export interface ITransactionParams {
  q?: string;
  date_from?: string;
  date_to?: string;

  period_from?: string;
  period_to?: string;
  group_id: string;
  group_name?: string;
  customer_id: string;
  page?: number;
  size?: number;
  types?: string[];
  transaction_categories?: string[];
  sort?: string;

  is_income?: boolean;
  is_expense?: boolean;

  product_name?: string;
  account_name?: string;

  // income
  channels?: string[];
  status?: string[];
  payment_methods?: string[];

  // expense
  source_accounts?: string[];
  transaction_types?: string[];

  //others
  expense_account_names?: string[];
  income_account_names?: string[];
}

export interface IExpenseBreakdownWrapper {
  filterAvailablesString: string;
  data: IExpenseBreakdown;
}

export interface IIncomeBreakdown {
  sum_total: number;
  breakdown_by: {
    channel: IBreakdownDetail[];
    status: IBreakdownDetail[];
    payment_method: IBreakdownDetail[];
  };
}

export interface IIncomeBreakdownWrapper {
  filterAvailablesString: string;
  data: IIncomeBreakdown;
}

export interface IBreakdownDetail {
  name: string;
  amount: number;
}

export interface IExpenseBreakdown {
  sum_total: number;
  breakdown_by: {
    source_accounts: IBreakdownDetail[];
    transaction_types: IBreakdownDetail[];
    transaction_categories: IBreakdownDetail[];
    types: IBreakdownDetail[];
  };
}

export interface IFilterAvailable {
  label: string;
  value: string[];
  key: string;
}

export const getTransactionIncomeInsight = async (
  httpClient: AxiosInstance,
  params: IInsightParams
) => {
  const { status, channels, payment_methods } = params;

  return httpClient
    .get<IIncomeInsight>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/income/insights`,
      {
        params: params && {
          date_from: params.date_from,
          date_to: params.date_to,
          period_from: params.period_from,
          period_to: params.period_to,
          group_ids: [params.group_id],
          customer_ids: [params.customer_id],
          ...(payment_methods && { payment_methods }),
          ...(channels && { channels }),
          ...(status && { status }),
        },
      }
    )
    .then((d) => {
      return {
        ...d.data,
        average_daily:
          (d.data.total_amount ?? 0) /
          (d.data.count_date_with_transactions ?? 1),
        average_nominal:
          (d.data.total_amount ?? 0) / parseInt(d.data.total_count ?? "1"),
      };
    });
};

export const getTransactionExpenseInsight = async (
  httpClient: AxiosInstance,
  params?: IInsightParams
) => {
  return await httpClient
    .get<IExpenseInsight>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/expense/insights`,
      {
        params: params && {
          date_from: params.date_from,
          date_to: params.date_to,
          period_from: params.period_from,
          period_to: params.period_to,
          group_ids: [params.group_id],
          customer_ids: [params.customer_id],
          transaction_types: params.transaction_types ?? [],
          source_accounts: params.source_accounts ?? [],
          types:
            params.types != undefined
              ? params.types.length > 0
                ? params.types
                : Object.values(ExpenseType)
              : Object.values(ExpenseType),
          ...(params.transaction_categories &&
            params.transaction_categories.length > 0 && {
              transaction_categories: params.transaction_categories,
            }),
        },
      }
    )
    .then((d) => {
      return {
        ...d.data,
        average_daily:
          d.data.total_amount / d.data.count_date_with_transactions || 0,
      };
    });
};

export const getTransactionExpenseSummary = async (
  httpClient: AxiosInstance,
  params?: ITransactionParams
) => {
  return httpClient
    .get(`${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/summary`, {
      params: params && {
        date_from: params.date_from,
        date_to: params.date_to,
        period_from: params.period_from,
        period_to: params.period_to,
        group_ids: [params.group_id],
        customer_ids: [params.customer_id],
        size: params.size,
        page: params.page,
        sort_by: "date",
        sort_type: "DESC",
        transaction_types: params.transaction_types ?? [],
        source_accounts: params.source_accounts ?? [],
        types:
          params.types != undefined
            ? params.types.length > 0
              ? params.types
              : Object.values(ExpenseType)
            : Object.values(ExpenseType),
        ...(params.transaction_categories &&
          params.transaction_categories.length > 0 && {
            transaction_categories: params.transaction_categories,
          }),
      },
    })
    .then((res) => {
      const formatDate = "d MMMM yyyy";
      const mappedData = res.data.map((d: any) => ({
        ...d,
        formatted_date: format(new Date(d.date), formatDate),
        formatted_amount: formatCurrency.format(d.amount),
      }));

      const totalSum = +res.headers["x-total-sum"] || 0;
      const totalCount = +res.headers["x-total-count"] || 0;

      return {
        total_amount: totalSum,
        formatted_total_amount: formatCurrency.format(totalSum),
        total_count: totalCount,
        data: mappedData,
      };
    });
};

export const getTransactionIncomeSummary = async (
  httpClient: AxiosInstance,
  params?: ITransactionParams
) => {
  let parameters: any = {
    date_from: params?.date_from,
    date_to: params?.date_to,
    period_from: params?.period_from,
    period_to: params?.period_to,
    group_ids: [params?.group_id],
    customer_ids: [params?.customer_id],
    size: params?.size,
    page: params?.page,
    sort_by: "date",
    sort_type: "DESC",
    income_types: params?.types,
  };

  const baseParams = JSON.parse(JSON.stringify(params));

  Object.keys(baseParams).forEach((key: string) => {
    if (baseParams[key] !== undefined && parameters[key] == undefined) {
      const newParams = {
        [key]: baseParams[key],
      };

      parameters = { ...parameters, ...newParams };
    }
  });

  return httpClient
    .get(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/income/summary`,
      {
        params: parameters,
      }
    )
    .then((res) => {
      const formatDate = "d MMMM yyyy";
      const mappedData = res.data.map((d: any) => {
        return {
          ...d,
          formatted_date: format(new Date(d.date), formatDate),
          formatted_amount: formatCurrency.format(d.amount),
        };
      });

      const totalSum = +res.headers["x-total-sum"] || 0;
      const totalCount = +res.headers["x-total-count"] || 0;

      return {
        total_amount: totalSum,
        formatted_total_amount: formatCurrency.format(totalSum),
        total_count: totalCount,
        data: mappedData,
      };
    });
};

export const getOtherSummary = (
  httpClient: AxiosInstance,
  params?: ITransactionParams
) => {
  return httpClient
    .get(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/margin/other`,
      {
        params: params && {
          date_from: params.date_from,
          date_to: params.date_to,
          period_from: params.period_from,
          period_to: params.period_to,
          group_ids: [params.group_id],
          customer_ids: [params.customer_id],
          size: params.size,
          page: params.page,
          sort_by: "date",
          sort_type: "DESC",
          expense_account_names: params.expense_account_names ?? [],
          income_account_names: params.income_account_names ?? [],
        },
      }
    )
    .then((res) => {
      const formatDate = "d MMMM yyyy";
      const mappedData = res.data.map((d: any) => {
        const details = [];

        //Pemasukan
        details.push({
          label: "Pemasukan Lainnya",
          type: DailyTransactionCategory.OtherIncome,
          amount: d.income?.amount || 0,
          formatted_amount: formatCurrency.format(d.income.amount),
        });

        //Pengeluaran
        details.push({
          label: "Pengeluaran Lainnya",
          type: DailyTransactionCategory.OtherExpense,
          amount: d.expense?.amount || 0,
          formatted_amount: formatCurrency.format(d.expense.amount),
        });

        return {
          ...d,
          formatted_date: format(new Date(d.date), formatDate),
          formatted_amount: formatCurrency.format(d.amount),
          details: details,
        };
      });
      const totalSum = +res.headers["x-total-sum"] || 0;
      const totalCount = +res.headers["x-total-count"] || 0;

      return {
        total_amount: totalSum,
        formatted_total_amount: formatCurrency.format(totalSum),
        total_count: totalCount,
        data: mappedData,
      };
    });
};

export const getTransactionExpenseBreakdown = async (
  httpClient: AxiosInstance,
  params?: IInsightParams
): Promise<IExpenseBreakdownWrapper> => {
  return await httpClient
    .get<IExpenseBreakdown>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/breakdown`,
      {
        params: params && {
          date_from: params.date_from,
          date_to: params.date_to,
          period_from: params.period_from,
          period_to: params.period_to,
          group_ids: [params.group_id],
          customer_ids: [params.customer_id],

          transaction_types: params.transaction_types ?? [],
          source_accounts: params.source_accounts ?? [],
          types:
            params.types != undefined
              ? params.types.length > 0
                ? params.types
                : ["bill", "other_transaction", "expense"]
              : ["bill", "other_transaction", "expense"],

          ...(params.transaction_categories &&
            params.transaction_categories.length > 0 && {
              transaction_categories: params.transaction_categories,
            }),
        },
      }
    )
    .then((res) => {
      return {
        filterAvailablesString: JSON.stringify(
          JSON.parse(res.headers["x-filter-availables"])
            .sort((a: IFilterAvailable, b: IFilterAvailable) =>
              a.label.localeCompare(b.label)
            )
            .map((d: IFilterAvailable) => {
              d.value = d.value.filter((v) => {
                switch (d.key) {
                  case "source_accounts":
                    return (
                      res.data.breakdown_by.source_accounts.find(
                        (b) => b.name == v
                      ) !== undefined
                    );
                  case "transaction_types":
                    return (
                      res.data.breakdown_by.transaction_types.find(
                        (b) => b.name == v
                      ) !== undefined
                    );
                  case "transaction_categories":
                    return (
                      res.data.breakdown_by.transaction_categories.find(
                        (b) => b.name == v
                      ) !== undefined
                    );
                }
                return false;
              });
              return d;
            })
        ),
        data: res.data,
      };
    });
};

export const getTransactionIncomeBreakdown = async (
  httpClient: AxiosInstance,
  params?: IInsightParams
): Promise<IIncomeBreakdownWrapper> => {
  return await httpClient
    .get<IIncomeBreakdown>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/income/breakdown`,
      {
        params: params && {
          date_from: params.date_from,
          date_to: params.date_to,
          period_from: params.period_from,
          period_to: params.period_to,
          group_ids: [params.group_id],
          customer_ids: [params.customer_id],

          // income
          channels: params.channels ?? [],
          payment_methods: params.payment_methods ?? [],
          status: params.status ?? [],
          ...(params.types && { incomeTypes: params.types }),
        },
      }
    )
    .then((res) => {
      return {
        filterAvailablesString: JSON.stringify(
          JSON.parse(res.headers["x-filter-availables"])
            .sort((a: IFilterAvailable, b: IFilterAvailable) =>
              a.label.localeCompare(b.label)
            )
            .map((d: IFilterAvailable) => {
              d.value = d.value.filter((v) => {
                switch (d.key) {
                  case "channels":
                    return (
                      res.data.breakdown_by.channel.find((b) => b.name == v) !==
                      undefined
                    );
                  case "payment_methods":
                    return (
                      res.data.breakdown_by.payment_method.find(
                        (b) => b.name == v
                      ) !== undefined
                    );
                  case "status":
                    return (
                      res.data.breakdown_by.status.find((b) => b.name == v) !==
                      undefined
                    );
                }
                return false;
              });
              return d;
            })
        ),
        data: res.data,
      };
    });
};

export const getOtherBreakdown = async (
  httpClient: AxiosInstance,
  params?: IInsightParams
): Promise<{
  filterAvailablesString: string;
  data: IOtherBreakdown;
}> => {
  return httpClient
    .get<IOtherBreakdown>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/other/breakdown`,
      {
        params: params && {
          date_from: params.date_from,
          date_to: params.date_to,
          period_from: params.period_from,
          period_to: params.period_to,
          group_ids: [params.group_id],
          customer_ids: [params.customer_id],
          expense_account_names: params.expense_account_names ?? [],
          income_account_names: params.income_account_names ?? [],
        },
      }
    )
    .then((res) => {
      return {
        filterAvailablesString: JSON.stringify(
          JSON.parse(res.headers["x-filter-availables"]).sort(
            (a: IFilterAvailable, b: IFilterAvailable) =>
              a.label.localeCompare(b.label)
          )
        ),
        data: res.data,
      };
    });
};

export interface IPnLInsight {
  nett_revenue: number | null;
  gross_profit: number | null;
  nett_profit: number | null;
  reecap: number | null;
}

export const getTransactionPnLInsight = (
  httpClient: AxiosInstance,
  params?: IInsightParams
) => {
  return httpClient.get<IPnLInsight>(
    `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/pnl/insights`,
    {
      params: params && {
        date_from: params.date_from,
        date_to: params.date_to,
        period_from: params.period_from,
        period_to: params.period_to,
        group_ids: [params.group_id],
        customer_ids: [params.customer_id],
      },
    }
  );
};

export const getTransactionRecap = async (
  httpClient: AxiosInstance,
  params?: ITransactionParams
) => {
  return httpClient
    .get(`${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/margin`, {
      params: params && {
        date_from: params.date_from,
        date_to: params.date_to,
        period_from: params.period_from,
        period_to: params.period_to,
        group_ids: [params.group_id],
        customer_ids: [params.customer_id],
        size: params.size,
        page: params.page,
        sort_by: "date",
        sort_type: "DESC",
      },
    })
    .then((res) => {
      const formatDate = "d MMMM yyyy";
      const mappedData = res.data.map((d: any) => {
        const details = [];

        // pendapatan bersih
        details.push({
          label: "Pendapatan Bersih",
          type: "income",
          amount: d.income_sale?.amount || 0,
        });

        // Bahan Baku, Marketing, Operasional
        details.push({
          label: "Bahan Baku, Marketing, Operasional",
          type: "expense",
          amount: d.expense_without_others?.amount || 0,
        });

        return {
          ...d,
          formatted_date: format(new Date(d.date), formatDate),
          formatted_amount: formatCurrency.format(
            (d.income_sale?.amount || 0) -
              Math.abs(d.expense_without_others?.amount || 0)
          ),
          details: details?.map((trans: any) => ({
            ...trans,
            formatted_amount: formatCurrency.format(trans.amount),
          })),
        };
      });

      const totalSum = +res.headers["x-total-sum"] || 0;
      const totalCount = +res.headers["x-total-count"] || 0;

      return {
        total_amount: totalSum,
        formatted_total_amount: formatCurrency.format(totalSum),
        data: mappedData,
        total_count: totalCount,
      };
    });
};

export const getTransactionPeriod = async (
  httpClient: AxiosInstance,
  group_id: string
) => {
  return httpClient
    .get(`${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/workpaper`, {
      params: {
        group_ids: [group_id],
      },
    })
    .then((res) => {
      const mappedData = res.data.map((d: any) => ({
        id: d.id,
        period: d.period,
        formatted_period: format(
          new Date(d.period),
          "MMM - yyyy"
        ).toUpperCase(),
        customer_id: d.customer_id,
        customer_name: d.customer_name,
        group_id: d.group_id,
        group_name: d.group_name,
      }));

      return mappedData;
    });
};

export const downloadTransactionCSV = async (
  httpClient: AxiosInstance,
  params: ITransactionParams
) => {
  const {
    date_from,
    date_to,
    group_id,
    group_name,
    customer_id,
    sort,
    types,
    q,
    is_income,
    is_expense,
  } = params;

  return httpClient
    .get(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/download-csv`,
      {
        params: {
          date_from: date_from,
          date_to: date_to,
          group_ids: [group_id],
          customer_ids: [customer_id],
          q: encodeURI((q as string) || ""),
          ...getSort(sort as SortTypes),
          ...(types && { types: types }),
          ...(is_income && { is_income }),
          ...(is_expense && { is_expense }),
        },
      }
    )
    .then((res) => {
      const fileName = `transaction_details_${group_name}_${date_from}.csv`;
      if (checkIsInAppWebView()) {
        // Convert the content to base64
        const base64Content = window.btoa(res.data);
        flutterHandleDownloadBlob({
          base64: base64Content,
          fileName,
        });
      } else {
        fileDownload(
          res.data,
          `transaction_details_${group_name}_${date_from}.csv`
        );
      }
    });
};

export interface ITransactionExpenses {
  details: ITransactionExpense[];
  total_count: number;
  total_amount: number;
  total_page: number;
}

export interface ITransactionExpense {
  account_name: string;
  total_price: number;
}

export const getTransactionExpenses = async (
  httpClient: AxiosInstance,
  params: {
    date_from?: string | null;
    date_to?: string | null | undefined;
    customer_id: string;
    group_id: string;
    page: number;
    size: number;
    sort: SortTypesItems;
    categories?: string[];
  }
) => {
  const {
    date_from,
    date_to,
    group_id,
    customer_id,
    page,
    size,
    sort,
    categories,
  } = params;

  let paramQuery: {
    group_ids: string[];
    customer_ids: string[];
    page: number;
    size: number;
    sort_by: string;
    sort_type: string;
    date_from?: string;
    date_to?: string;
    categories?: string[];
  } = {
    group_ids: [group_id],
    customer_ids: [customer_id],
    page,
    size,
    ...getSortExpenses(sort as SortTypesItems),
  };

  if (date_from) {
    paramQuery["date_from"] = date_from;
  }

  if (date_to) {
    paramQuery["date_to"] = date_to;
  }

  if (categories && categories.length > 0) {
    paramQuery["categories"] = categories;
  }

  return httpClient
    .get(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/expenses`,
      {
        params: paramQuery,
      }
    )
    .then((resp) => {
      const totalCount = +resp.headers["x-total-count"] || 0;
      const totalSum = +resp.headers["x-total-sum"] || 0;
      const totalPage = +resp.headers["x-total-page"] || 0;

      const data: ITransactionExpenses = {
        total_count: totalCount,
        total_amount: totalSum,
        total_page: totalPage,
        details: resp.data.map((d: any) => ({
          ...d,
          total_price: Math.abs(d.total_price),
        })),
      };

      return data;
    });
};

export interface ITransactionItems {
  details: ITransactionItem[];
  total_count: number;
  total_amount: number;
  total_page: number;
}

export interface ITransactionItem {
  product_name: string;
  unit_package: string;
  total_quantity: number;
  total_price: number;
  group_id: string;
}

const getSortItems = (sort: SortTypesItems) => {
  switch (sort) {
    case SortTypesItems.NameDesc:
      return {
        sort_by: "product_name",
        sort_type: "DESC",
      };

    case SortTypesItems.PriceAsc:
      return {
        sort_by: "total_price",
        sort_type: "ASC",
      };

    case SortTypesItems.PriceDesc:
      return {
        sort_by: "total_price",
        sort_type: "DESC",
      };
    case SortTypesItems.QuantityAsc:
      return {
        sort_by: "total_quantity",
        sort_type: "ASC",
      };
    case SortTypesItems.QuantityDesc:
      return {
        sort_by: "total_quantity",
        sort_type: "DESC",
      };

    default:
      return {
        sort_by: "product_name",
        sort_type: "ASC",
      };
  }
};

export const getTransactionItems = async (
  httpClient: AxiosInstance,
  params: {
    date_from?: string | null;
    date_to?: string | null | undefined;
    customer_id: string;
    group_id: string;
    page: number;
    size: number;
    sort: SortTypesItems;
  }
) => {
  const { date_from, date_to, group_id, customer_id, page, size, sort } =
    params;

  let paramQuery: {
    group_ids: string[];
    customer_ids: string[];
    page: number;
    size: number;
    sort_by: string;
    sort_type: string;
    date_from?: string;
    date_to?: string;
  } = {
    group_ids: [group_id],
    customer_ids: [customer_id],
    page,
    size,
    ...getSortItems(sort as SortTypesItems),
  };

  if (date_from) {
    paramQuery["date_from"] = date_from;
  }

  if (date_to) {
    paramQuery["date_to"] = date_to;
  }

  return httpClient
    .get(`${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/items`, {
      params: paramQuery,
    })
    .then((resp) => {
      const totalCount = +resp.headers["x-total-count"] || 0;
      const totalSum = +resp.headers["x-total-sum"] || 0;
      const totalPage = +resp.headers["x-total-page"] || 0;

      const data: ITransactionItems = {
        total_count: totalCount,
        total_amount: totalSum,
        total_page: totalPage,
        details: resp.data.map((d: any) => ({
          ...d,
          total_price: Math.abs(d.total_price),
        })),
      };

      return data;
    });
};

export const downloadTransactionItemsRecapCSV = async (
  httpClient: AxiosInstance,
  params: ITransactionParams
) => {
  const {
    date_from,
    date_to,
    group_id,
    group_name,
    customer_id,
    sort,
    types,
    q,
    is_income,
    is_expense,
  } = params;

  return httpClient
    .get(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/items/recap/download-csv`,
      {
        params: {
          date_from: date_from,
          date_to: date_to,
          group_ids: [group_id],
          customer_ids: [customer_id],
          ...getSortItems(sort as SortTypesItems),
        },
      }
    )
    .then((res) => {
      const fileName = `data_bahan_baku_rekap_transaksi_${group_name}_${date_from}.csv`;
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

export const downloadExpensesRecapCSV = async (
  httpClient: AxiosInstance,
  params: ITransactionParams
) => {
  const { date_from, date_to, group_id, group_name, customer_id, sort } =
    params;

  return httpClient
    .get(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/expenses/recap/download-csv`,
      {
        params: {
          date_from: date_from,
          date_to: date_to,
          group_ids: [group_id],
          customer_ids: [customer_id],
          ...getSortExpenses(sort as SortTypesItems),
        },
      }
    )
    .then((res) => {
      const fileName = `data_biaya_rekap_transaksi_${group_name}_${date_from}.csv`;
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

export const downloadExpensesCSV = async (
  httpClient: AxiosInstance,
  params: ITransactionParams
) => {
  const { date_from, date_to, group_id, group_name, customer_id } = params;

  return httpClient
    .get(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/expenses/download-csv`,
      {
        params: {
          date_from: date_from,
          date_to: date_to,
          group_ids: [group_id],
          customer_ids: [customer_id],
        },
      }
    )
    .then((res) => {
      const fileName = `data_biaya_semua_transaksi_${group_name}_${date_from}.csv`;
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

export const downloadTransactionItemsCSV = async (
  httpClient: AxiosInstance,
  params: ITransactionParams
) => {
  const {
    date_from,
    date_to,
    group_id,
    group_name,
    customer_id,
    sort,
    types,
    q,
    is_income,
    is_expense,
  } = params;

  return httpClient
    .get(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/items/download-csv`,
      {
        params: {
          date_from: date_from,
          date_to: date_to,
          group_ids: [group_id],
          customer_ids: [customer_id],
        },
      }
    )
    .then((res) => {
      const fileName = `data_bahan_baku_semua_transaksi_${group_name}_${date_from}.csv`;
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

export interface ITransactionIncomeParams {
  q?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  size?: number;
  types?: string[];
  sort?: string;
  group_id: string;
  group_name: string;
  customer_id: string;
  channels?: string[];
  payment_methods?: string[];
  status?: string[];
  transaction_types?: string[];
  source_accounts?: string[];
}

export const downloadTransactionIncomeCSV = (
  httpClient: AxiosInstance,
  params: ITransactionIncomeParams
) => {
  const {
    date_from,
    date_to,
    group_id,
    group_name,
    customer_id,
    sort,
    payment_methods,
    channels,
    q,
    types,
  } = params;

  return httpClient
    .get(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/income/download-csv`,
      {
        params: {
          date_from: date_from,
          date_to: date_to,
          group_ids: [group_id],
          customer_ids: [customer_id],
          q: encodeURI((q as string) || ""),
          ...getSort(sort as SortTypes, CategoryTransaction.Income),
          ...(q && { q: encodeURI((q as string) || "") }),
          ...(payment_methods && { payment_methods: payment_methods }),
          ...(channels && { channels: channels }),
          ...(types && { income_types: types }),
        },
      }
    )
    .then((res) => {
      const fileName = `transaction_income_details_${group_name}_${date_from}.csv`;
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

export const getTransactionIncome = (
  httpClient: AxiosInstance,
  params: ITransactionIncomeParams
) => {
  const {
    status,
    channels,
    payment_methods,
    date_from,
    date_to,
    group_id,
    customer_id,
    size,
    page,
    sort,
    types,
    q,
  } = params;

  const resp: Promise<ITransaction> = httpClient
    .get<IAccountingTransactionIncome[]>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/income`,
      {
        params: {
          date_from: date_from,
          date_to: date_to,
          group_ids: [group_id],
          customer_ids: [customer_id],
          size: size,
          page: page,
          ...getSort(sort as SortTypes, CategoryTransaction.Income),
          ...(q && { q: encodeURI((q as string) || "") }),
          ...(payment_methods && { payment_methods }),
          ...(channels && { channels }),
          ...(status && { status }),
          ...(types && { income_types: types }),
        },
      }
    )
    .then((resp) => {
      const totalSum = +resp.headers["x-total-sum"] || 0;
      const totalItem = +resp.headers["x-total-count"] || 0;
      const filterAvailables = JSON.parse(
        resp.headers["x-filter-availables"]
      ) as IFilterAvailable[];

      const respArray: ITransactionIncomeDetail[] = resp.data.map((d) => {
        const resp: ITransactionIncomeDetail = {
          date: d.date,
          channel: d.channel,
          order_id: d.order_id,
          status: d.status,
          description: d.description,
          payment_method: d.payment_method,
          amount: d.amount,
          formatted_amount: formatCurrency.format(d.amount || 0),
          created_at: d.created_at,
          updated_at: d.updated_at,
        };

        return resp;
      });

      const respModel: ITransaction = {
        filter_availables: filterAvailables,
        details: respArray,
        total_amount: totalSum,
        total_item: totalItem,
        formatted_total_amount: formatCurrency.format(totalSum),
        formatted_total_item: formatNumber.format(totalItem),
      };

      return respModel;
    });

  return resp;
};

export const getTransaction = (
  httpClient: AxiosInstance,
  params: ITransactionParams
) => {
  const {
    date_from,
    date_to,
    group_id,
    customer_id,
    size,
    page,
    sort,
    types,
    q,
    transaction_types,
    source_accounts,
    product_name,
    account_name,
    is_expense,
    is_income,
    transaction_categories,
  } = params;
  const resp: Promise<ITransaction> = httpClient
    .get<IAccountingTransaction[]>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction`,
      {
        params: {
          date_from: date_from,
          date_to: date_to,
          group_ids: [group_id],
          customer_ids: [customer_id],
          size: size,
          page: page,
          q: encodeURIComponent((q as string) || ""),
          ...getSort(sort as SortTypes),
          ...(types && {
            types:
              types != undefined
                ? types.length > 0
                  ? types
                  : Object.values(ExpenseType)
                : Object.values(ExpenseType),
          }),
          ...(transaction_categories && {
            transaction_categories: transaction_categories,
          }),
          ...(transaction_types && { transaction_types }),
          ...(source_accounts && { source_accounts }),
          ...(product_name && {
            product_name: encodeURIComponent(product_name),
          }),
          ...(account_name && {
            account_name: encodeURIComponent(account_name),
          }),
          ...(is_expense && {
            is_expense: is_expense,
          }),
          ...(is_income && {
            is_income: is_income,
          }),
        },
      }
    )
    .then((resp) => {
      const totalSum = +resp.headers["x-total-sum"] || 0;
      const totalItem = +resp.headers["x-total-count"] || 0;

      const respArray: ITransactionDetail[] = resp.data.map((d) => {
        const resp: ITransactionDetailResp = {
          code: d.code,
          date: d.date,
          name: d.product_name || d.remark || "-",
          unit_price: d.unit_price,
          formatted_unit_price: formatCurrency.format(d.unit_price || 0),
          total: Math.abs(d.total),
          formatted_total: formatCurrency.format(d.total || 0),
          source_account: d.source_account,
          unit_package: d.unit_package,
          qty: d.qty,
          document: d.document || "-",
          transaction_type: d.transaction_type,
          union_transaction_type: d.union_transaction_type,
          is_anomaly: d.is_anomaly || false,
          remark: d.remark,
          transaction_category: d.transaction_category,
        };

        return resp;
      });

      const respModel: ITransaction = {
        details: respArray,
        total_amount: totalSum,
        total_item: totalItem,
        formatted_total_amount: formatCurrency.format(totalSum),
        formatted_total_item: formatNumber.format(totalItem),
      };

      return respModel;
    });

  return resp;
};

export const getLabelTransactionCategory = (keyLabel: string) => {
  switch (keyLabel) {
    case TransactionCategories.Marketing:
      return "Marketing";
    case TransactionCategories.Material:
      return "Bahan Baku";
    case TransactionCategories.Operational:
      return "Operasional";
    default:
      return "Lainnya";
  }
};

export enum TransactionCategories {
  Marketing = "marketing",
  Material = "material",
  Others = "others",
  Operational = "operational",
}
