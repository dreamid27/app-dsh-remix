import { AxiosInstance } from "axios";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

export enum OnboardingType {
  KICKOFF = "kickoff",
  ADMIN_TRAINING = "admin_training",
  INITIAL_DATA = "initial_data",
  BANK_MUTATION = "bank_mutation",
  NOTA = "nota",
  INTEGRATION = "integration",
  AM_CHECK = "am_check",
  CHECK_DAILY_REPORT = "check_daily_report",
  CHECK_MONTHLY_REPORT = "check_monthly_report",
  FIRST_PRESENTATION_MONTHLY = "first_presentation_monthly",
}

export enum OnboardingStatus {
  INCOMPLETED = "incompleted",
  ONGOING = "ongoing",
  LONG_ONBOARDING = "long_onboarding",
  COMPLETED = "completed",
}

export interface ICustomerOnboarding {
  type: OnboardingType;
  label: string;
  date: string;
  notes: string;
}

export interface ICustomer {
  customer_details: {
    onboarding_status: OnboardingStatus;
    new_onboardings: ICustomerOnboarding[];
  };
}

export const getCustomer = async (httpClient: AxiosInstance, id: string) => {
  const resp = await httpClient.get<ICustomer>(`${API_URL}/customers/${id}`);
  return resp?.data;
};
