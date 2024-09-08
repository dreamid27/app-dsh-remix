import mock from "utils/test/axiosMock";

import { ExpenseType } from "services/transactions";
import { describe, expect, it } from "vitest";
import {
  getTransactionExpenseInsight,
  getTransactionExpenseSummary,
  IExpenseInsight,
  IInsightParams,
  ITransactionParams,
} from "services/transactions"; // Adjust the path as per your project structure
import httpClient from "utils/providers/dataProvider";

describe("Transaction Services", () => {
  it("should fetch transaction summary correctly", async () => {
    const params: ITransactionParams = {
      date_from: "2024-01-01",
      date_to: "2024-06-30",
      period_from: "2024-06",
      period_to: "2024-06",
      group_id: "your-group-id",
      customer_id: "your-customer-id",
      page: 1,
      size: 10,
      transaction_types: ["expense"],
      source_accounts: ["account-1", "account-2"],
    };

    const mockResponse = [
      { date: "2024-06-01", amount: 100 },
      { date: "2024-06-02", amount: 150 },
    ];

    const totalSum = 250;
    const totalCount = 2;

    mock
      .onGet(
        `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/summary`,
        {
          params: {
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
            types: Object.values(ExpenseType),
          },
        }
      )
      .reply(200, mockResponse, {
        "x-total-sum": totalSum,
        "x-total-count": totalCount,
      });

    const result = await getTransactionExpenseSummary(httpClient, params);

    expect(result.total_amount).toEqual(totalSum);
    expect(result.total_count).toEqual(totalCount);
    expect(result.data).toHaveLength(2); // Assuming mockResponse has 2 items
  });

  it("should fetch transaction transaction expense insight correctly", async () => {
    const params: IInsightParams = {
      date_from: "2024-04-01",
      date_to: "2024-04-30",
      period_from: "2024-04",
      period_to: "2024-04",
      group_id: "-1001745048540",
      customer_id: "85845bcd-ded7-4a42-848f-36dc3cb0cf1c",
    };

    const mockResponse: IExpenseInsight = {
      total_amount: 445141150,
      total_count: "2433",
      total_amount_material: 373450500,
      total_amount_marketing: 0,
      total_amount_others: 0,
      total_amount_operational: 71690650,
      average_daily: 14838038.333333334,
      highest_date: {
        date: "2024-04-16",
        total_amount: 64172900,
      },
      lowest_date: {
        date: "2024-04-10",
        total_amount: 190000,
      },
      count_date_with_transactions: 30,
      last_transaction: [
        {
          date: "2024-04-30",
          total_amount: 22142000,
          is_anomaly: false,
        },
        {
          date: "2024-04-29",
          total_amount: 7890500,
          is_anomaly: false,
        },
        {
          date: "2024-04-28",
          total_amount: 13902300,
          is_anomaly: false,
        },
        {
          date: "2024-04-27",
          total_amount: 13211600,
          is_anomaly: false,
        },
        {
          date: "2024-04-26",
          total_amount: 7540000,
          is_anomaly: false,
        },
      ],
      median_amount_group_by_date: 11781450,
      top_items_amount_based: [
        {
          name: "Ayam",
          total_amount: 54900000,
        },
        {
          name: "Beras",
          total_amount: 21220000,
        },
        {
          name: "Minyak (dus)",
          total_amount: 20439000,
        },
        {
          name: "LPG 12KG",
          total_amount: 16740000,
        },
        {
          name: "Ikan Nila",
          total_amount: 13838000,
        },
      ],
      top_items_count_based: [
        {
          name: "Tomat",
          total_count: 60,
        },
        {
          name: "Kelapa",
          total_count: 55,
        },
        {
          name: "Cabe Merah",
          total_count: 47,
        },
        {
          name: "Cumi",
          total_count: 44,
        },
        {
          name: "Bawang putih kupas",
          total_count: 39,
        },
      ],
      top_expense_amount_based: [
        {
          name: "PB1",
          total_amount: 49933900,
        },
        {
          name: "Kebersihan",
          total_amount: 8673800,
        },
        {
          name: "Listrik",
          total_amount: 3517500,
        },
        {
          name: "Makanan",
          total_amount: 2957000,
        },
        {
          name: "THR & Bonus",
          total_amount: 2850000,
        },
      ],
      group_by_source_account: [
        {
          name: "Kas",
          total_amount: 445141150,
          total_count: 2433,
        },
      ],
      group_by_transaction_type: [
        {
          name: "Pembelian lunas",
          total_amount: 373450500,
          total_count: 2176,
        },
        {
          name: "",
          total_amount: 71690650,
          total_count: 257,
        },
      ],
      group_by_transaction_category: [
        {
          name: "material",
          total_amount: 373450500,
          total_count: 2176,
        },
        {
          name: "operational",
          total_amount: 71690650,
          total_count: 257,
        },
      ],
      anomalies: [
        {
          date: "2024-04-21",
          total_amount: 27102000,
          is_anomaly: true,
        },
        {
          date: "2024-04-16",
          total_amount: 64172900,
          is_anomaly: true,
        },
        {
          date: "2024-04-14",
          total_amount: 43285000,
          is_anomaly: true,
        },
        {
          date: "2024-04-13",
          total_amount: 16683000,
          is_anomaly: true,
        },
        {
          date: "2024-04-12",
          total_amount: 18570000,
          is_anomaly: true,
        },
        {
          date: "2024-04-11",
          total_amount: 16773000,
          is_anomaly: true,
        },
        {
          date: "2024-04-07",
          total_amount: 27790400,
          is_anomaly: true,
        },
        {
          date: "2024-04-04",
          total_amount: 11603900,
          is_anomaly: true,
        },
        {
          date: "2024-04-02",
          total_amount: 11968000,
          is_anomaly: true,
        },
      ],
    };

    mock
      .onGet(
        `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/transaction/expense/insights`,
        {
          params: {
            date_from: params.date_from,
            date_to: params.date_to,
            period_from: params.period_from,
            period_to: params.period_to,
            group_ids: [params.group_id],
            customer_ids: [params.customer_id],
            transaction_types: [],
            source_accounts: [],
            types: ["bill", "other_transaction", "expense"],
          },
        }
      )
      .reply(200, mockResponse);

    const result = await getTransactionExpenseInsight(httpClient, params);

    //expect like mock response
    expect(result).toEqual(mockResponse);
  });
});
