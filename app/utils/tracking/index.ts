/* IMPORTANT: before adding tracking, please make sure the format exactly same like explain in the README.md */

import posthog from "posthog-js";
export const trackingLogoutClicked = () => {
  posthog.capture("signout_clicked");
};

export const trackingLogoutSubmit = () => {
  posthog.capture("signout");
};

export const trackingLoginClicked = () => {
  posthog.capture("signin_clicked");
};

export const trackingLoginSubmit = () => {
  posthog.capture("signin");
};

export const trackingContactClicked = (type: string, label: string) => {
  posthog.capture("contact_clicked", {
    type,
    label,
  });
};

export const trackingChooseOutletClicked = () => {
  return posthog.capture("choose_outlet_clicked");
};

export const trackingOutletSelected = (outlet: string) => {
  return posthog.capture("outlet_selected", {
    outlet,
  });
};

/* root no specific to page */
export const PWA_INSTALLED = "pwa_installed";
export const PWA_TRIGGER_INSTALL_PROMPT = "pwa_trigger_install_prompt";
export const PWA_ACCEPT_INSTALL_PROMPT = `pwa_accept_install_prompt`;
export const PWA_DISMISSED_INSTALL_PROMPT = `pwa_dismissed_install_prompt`;
export const PWA_CANCEL_INSTALL = `pwa_cancel_install`;

export const CONFIRMATION_CANCELLED = `confirmation_cancelled`;
export const CONFIRMATION_CONFIRMED = `confirmation_confirmed`;

export const HUBUNGI_AM_SUBMITTED = `hubungi_am_submitted`;
export const HUBUNGI_AM_SUCCESS = `hubungi_am_success`;
export const HUBUNGI_AM_ERROR = `hubungi_am_error`;

export const EMPTY_DAILY_REPORT_CONTACT_AM = `empty_daily_report_contact_am_cicked`;
export const EMPTY_DAILY_REPORT_ACCOUNT_INTEGRATION = `empty_daily_report_account_integration_cicked`;

export const EMPTY_MONTHLY_REPORT_UPLOAD_DATA_CLICKED = `empty_monthly_report_upload_data_clicked`;
export const EMPTY_MONTHLY_REPORT_SEE_TASK_CLICKED = `empty_monthly_report_see_task_clicked`;

export const TOP_MENU_GUIDE_CLICKED = `top_menu_guide_clicked`;
export const HEADER_TOP_MENU_OPEN_DRAWER = `header_top_menu_open_drawer`;
export const HEADER_TOP_MENU_CLICKED = `header_top_menu_clicked`;

export const MODAL_NEW_FEATURE_CLOSE = `modal_new_feature_close`;
export const MODAL_NEW_FEATURE_SEE_NOW = `modal_new_feature_see_now`;

export const FORGOT_PASSWORD_ERROR = `forgot_password_error`;

export const USER_EMAIL_COPY_CLIPBOARD = `user_email_copy_clipboard`;

export const VISIT_APP = `visit_app`;

export const POPOVER_CLOSED = `popover_closed`; //prop pages and event

export const RESTRICTED_CONTACT_BUTTON_CLICKED =
  "restricted_contact_button_clicked";

export const TOP_MENU_OUTLET_CLICKED = "top_menu_outlet_clicked";
export const TOP_MENU_PROFILE_CLICKED = "top_menu_profile_clicked";

export const OUTLET_CHANGED = "outlet_changed";

export const BOTTOM_MENU_CLICKED = "bottom_menu_clicked";

export const MODAL_BANNER_IN_APP_CLICKED = "modal_banner_in_app_clicked";
export const MODAL_BANNER_IN_APP_CLOSED = "modal_banner_in_app_closed";
