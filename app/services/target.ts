import { AxiosInstance } from "axios";

export interface IProfitTarget {
  group_id: string;
  target: number;
  period: string;
  type: string;
}

export interface ITarget {
  group_id: string;
  target: number;
  period: string;
  type: string;
}

export interface IProfitTargetProgressDetail {
  omzet: number;
  diff_with_total_income: number;
  daily_nominal: number;
  daily_transaction_count: number;
}
export interface IProfitTargetProgress {
  total_income: number;
  bep: IProfitTargetProgressDetail;
  target: IProfitTargetProgressDetail;
}

export const getProfitTarget = async (
  httpClient: AxiosInstance,
  params?: { group_id: string; period?: string; type: string }
) => {
  return httpClient
    .get<IProfitTarget>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/target`,
      {
        params: params && {
          group_id: params.group_id,
          period: params.period,
        },
      }
    )
    .then((res) => res.data);
};

export const getProfitTargetProgress = async (
  httpClient: AxiosInstance,
  params?: { group_id: string; period: string; customer_id: string }
) => {
  return httpClient
    .get<IProfitTargetProgress>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/target/profit-progress`,
      {
        params: params && {
          group_id: params.group_id,
          period: params.period,
          customer_id: params.customer_id,
        },
      }
    )
    .then((res) => res.data);
};

export const setProfitTarget = async (
  httpClient: AxiosInstance,
  body: ITarget
) => {
  return httpClient
    .put<IProfitTarget>(
      `${process.env.NEXT_PUBLIC_DELEGASI_ACC_API}/v1/target`,
      body
    )
    .then((res) => res.data);
};
