import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { IPlatformInfo } from "./platformInfo";
import { RouteTypes } from "./routeModel";

interface ObjectLiteral {
  [key: string]: any;
}

export type IOutlet = {
  customer_id: string;
  customer_name: string;
  outlet_name: string;
  telegram_chat_id: string;
  active_chat_id: string;
  user_role: string;
  chat_url: string;
  email: string;
  last_recorded_date: string;
  last_income_record_Date: string;
  last_expense_record_date: string;
  last_upload_date: string;
  total_processed_note: number;
  total_note: number;
  withdrawal_bank_account_id?: string;
  task_count?: number;
  is_kyb?: boolean;
  is_payment_in_active?: boolean;
  business: {
    phone?: string;
    address?: string;
    category?: string;
    city?: string;
    province?: string;
    email?: string;
    logo?: string;
  };
};

export interface IRequestAuth {
  email: string;
  google_user_id: string;
  telegram_user_id: string;
  provider: string;
  name: string;
}

export type IUser = {
  customerId: string;
  customerName: string;
  customerActive: boolean;
  companyName: string;
  telegramUserId: string;
  telegramChatId: string;
  id: string;
  phoneNumber: string;
  name: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  username: string;
  chatUrl: string;
  userRole: string;
  referrerCode: string;
  outlets: IOutlet[];
  isCustomer: boolean;
  email?: string;
  platform_info: IPlatformInfo | undefined;
  isIncognito: boolean | undefined;
  onboardingStatus: string;
  accessFeatures?: {
    [key: string]: boolean;
  };
  userOnboarded: boolean;
};

export interface IAuthProps {
  isLoading: boolean;
  isLoadingUser: boolean;
  handleLoginV2: (response: any, isDummy?: boolean) => Promise<void>;
  handleLogout: () => void;
  handleIncognito: (token: string) => void;
  refreshUser: () => void;
  isLogin: boolean;
  user: IUser | null;
  platformInfo: IPlatformInfo | undefined;
  isSelfRegister?: boolean;
}

export interface IAuthHelper {
  type: RouteTypes;
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>;
}

export interface SupabaseAuthUser {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email: string;
  phone: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  role: string;
  aal: string;
  amr: Amr[];
  session_id: string;
}

export interface AppMetadata {
  provider: string;
  providers: string[];
}

export interface UserMetadata {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  picture: string;
  provider_id: string;
  sub: string;
}

export interface Amr {
  method: string;
  timestamp: number;
}

export interface IRequestMe {
  name: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  id: string;
  company_name: string;
  telegram_user_id: string;
  telegram_chat_id: string;
  user_role: string;
  chat_url: string;
  customer_id: string;
  customer_name: string;
  customer_active: boolean;
  referrer_code: string;
  outlets: IOutlet[];
  username: string;
  photo_url: string;
  is_incognito: boolean;
  onboarding_status: string;
  user_onboarded: boolean;
}
