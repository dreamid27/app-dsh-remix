import {
  TypeMutation,
  Status,
  StatusSaldo,
} from "containers/payment-link/constants";
import {
  IPaymentLink,
  IPaymentLinkForm,
  IPaymentLinkGenerate,
  IPaymentLinkSummary,
  IPaymentParams,
  ISaldo,
  ISaldoHistories,
  ISaldoHistoriesParams,
} from "./payment-invoice";

export const mockDataPaymentLink: {
  params: IPaymentParams;
  data: IPaymentLink[];
} = {
  params: {
    group_id: "-1001745048540",
    size: 10,
    page: 1,
  },
  data: [
    {
      id: "1", //ada
      buyer_name: "John Doe", //ada
      ref_id: "123e4567-e89b-12d3-a456-426614174000", //
      invoice_number: "INV-001", //
      invoice_date: "2024-07-19", //
      requested_amount: 100000,
      fee_amount: 20000, //
      total_amount: 120000, //
      fee_charged_to: "buyer", //fee_amount charged to
      due_date: "2024-04-01", //
      note: "Sample note", //note
      status: Status.CREATED,
      paid_at: "2024-04-02", //hellow
      unique_code: "",
      fee_percentage: 0.2,
    },
    {
      id: "2",
      buyer_name: "John Week",
      ref_id: "223e4567-e89b-12d3-a456-426614174000",
      invoice_number: "INV-002",
      invoice_date: "2024-07-20",
      requested_amount: 400000,
      fee_amount: 600000,
      fee_charged_to: "buyer",
      total_amount: 200000,
      due_date: "2024-07-22",
      note: "hellow",
      status: Status.EXPIRED,
      paid_at: "2024-07-22",
      unique_code: "",
      fee_percentage: 0.2,
    },
    {
      id: "3",
      buyer_name: "John Week",
      ref_id: "223e4567-e89b-12d3-a456-426614174000",
      invoice_number: "INV-002",
      invoice_date: "2024-07-20",
      requested_amount: 400000,
      fee_amount: 600000,
      fee_charged_to: "buyer",
      total_amount: 200000,
      due_date: "2024-07-22",
      note: "hellow",
      status: Status.PAID,
      paid_at: "2024-07-22",
      unique_code: "",
      fee_percentage: 0.2,
    },
  ],
};

export const mockDataPaymentLinkPending: {
  params: IPaymentParams;
  data: IPaymentLink[];
} = {
  params: {
    statuses: [Status.CREATED],
    group_id: "-1001745048540",
    size: 10,
    page: 1,
  },
  data: [
    {
      id: "1",
      buyer_name: "John Week",
      ref_id: "223e4567-e89b-12d3-a456-426614174000",
      invoice_number: "INV-002",
      invoice_date: "2024-07-20",
      requested_amount: 400000,
      fee_amount: 600000,
      fee_charged_to: "buyer",
      total_amount: 200000,
      due_date: "2024-07-22",
      note: "hellow",
      status: Status.CREATED,
      paid_at: "2024-07-23",
      unique_code: "",
      fee_percentage: 0.2,
    },
    {
      id: "3",
      buyer_name: "John Hellow",
      ref_id: "423e4567-e89b-12d3-a456-426614174000",
      invoice_number: "INV-002",
      invoice_date: "2024-07-20",
      requested_amount: 400000,
      fee_amount: 600000,
      fee_charged_to: "buyer",
      total_amount: 200000,
      due_date: "2024-07-22",
      note: "hellow",
      status: Status.CREATED,
      paid_at: "2024-07-28",
      unique_code: "",
      fee_percentage: 0.2,
    },
    {
      id: "4",
      buyer_name: "John Ado",
      ref_id: "623e4567-e89b-12d3-a456-426614174000",
      invoice_number: "INV-002",
      invoice_date: "2024-07-20",
      requested_amount: 900000,
      fee_amount: 600000,
      fee_charged_to: "buyer",
      total_amount: 200000,
      due_date: "2024-07-22",
      note: "hellow",
      status: Status.CREATED,
      paid_at: "2024-07-28",
      unique_code: "",
      fee_percentage: 0.2,
    },
  ],
};

export const mockDataPaymentLinkLate: {
  params: IPaymentParams;
  data: IPaymentLink[];
} = {
  params: {
    statuses: [Status.EXPIRED],
    group_id: "-1001745048540",
    size: 10,
    page: 1,
  },
  data: [
    {
      id: "4",
      buyer_name: "John Ado",
      ref_id: "623e4567-e89b-12d3-a456-426614174000",
      invoice_number: "INV-002",
      invoice_date: "2024-07-20",
      requested_amount: 900000,
      fee_amount: 600000,
      fee_charged_to: "buyer",
      total_amount: 200000,
      due_date: "2024-07-22",
      note: "hellow",
      status: Status.EXPIRED,
      paid_at: "",
      unique_code: "",
      fee_percentage: 0.2,
    },
  ],
};

export const mockDataPaymentLinkPaid: {
  params: IPaymentParams;
  data: IPaymentLink[];
} = {
  params: {
    statuses: [Status.PAID],
    group_id: "-1001745048540",
    size: 10,
    page: 1,
  },
  data: [],
};

export const mockCreatePaymentLink: {
  body: IPaymentLinkForm;
  data: IPaymentLink;
} = {
  body: {
    id: "123e4567-e89b-12d3-a456-426614174000",
    buyer_name: "Good Day",
    invoice_number: "INV-001",
    invoice_date: "2024-07-19",
    requested_amount: 100000,
    due_date: "2024-07-19",
    fee_charged_to: "buyer",
    note: "Note",
    group_id: "-1001745048540",
  },
  data: {
    id: "4",
    buyer_name: "John Ado",
    ref_id: "623e4567-e89b-12d3-a456-426614174000",
    invoice_number: "INV-002",
    invoice_date: "2024-07-20",
    requested_amount: 900000,
    fee_amount: 600000,
    fee_charged_to: "buyer",
    total_amount: 200000,
    due_date: "2024-07-22",
    note: "hellow",
    status: Status.EXPIRED,
    paid_at: "",
    unique_code: "",
    fee_percentage: 0.2,
  },
};

export const mockDataPaymentLinkDetail: {
  id: string;
  data: IPaymentLink;
} = {
  id: "1",
  data: {
    id: "1",
    buyer_name: "John Ado",
    ref_id: "623e4567-e89b-12d3-a456-426614174000",
    invoice_number: "INV-002",
    invoice_date: "2024-07-20",
    requested_amount: 900000,
    fee_amount: 600000,
    fee_charged_to: "buyer",
    total_amount: 200000,
    due_date: "2024-07-22",
    note: "hellow",
    status: Status.EXPIRED,
    paid_at: "",
    unique_code: "",
    fee_percentage: 0.2,
  },
};

export const mockDataPaymentLinkDetailPending = {
  id: "1",
  data: {
    id: "1",
    buyer_name: "John Ado",
    ref_id: "623e4567-e89b-12d3-a456-426614174000",
    invoice_number: "INV-002",
    invoice_date: "2024-07-20",
    requested_amount: 900000,
    fee_amount: 600000,
    fee_charged_to: "buyer",
    total_amount: 200000,
    due_date: "2024-07-22",
    note: "hellow",
    status: Status.CREATED,
    paid_at: "",
  },
};
export const mockDataPaymentLinkDetailPaid = {
  id: "1",
  data: {
    id: "1",
    buyer_name: "John Ado",
    ref_id: "623e4567-e89b-12d3-a456-426614174000",
    invoice_number: "INV-002",
    invoice_date: "2024-07-20",
    requested_amount: 900000,
    fee_amount: 600000,
    fee_charged_to: "buyer",
    total_amount: 200000,
    due_date: "2024-07-22",
    note: "hellow",
    status: Status.PAID,
    paid_at: "2024-07-23",
  },
};

export const mockDataPaymentLinkSummaries: {
  params: {
    group_id: string;
  };
  data: IPaymentLinkSummary[];
} = {
  params: {
    group_id: "-1001745048540",
  },
  data: [
    {
      status: Status.CREATED,
      count: 30,
      total_amount: 120000,
    },
    {
      status: Status.EXPIRED,
      count: 20,
      total_amount: 200000,
    },
  ],
};

export const mockGeneratePaymentLink: {
  id: string;
  data: IPaymentLinkGenerate;
} = {
  id: "1",
  data: {
    link: "/link-invoice",
  },
};

export const mockSaldoSummary: {
  params: {
    group_id: string;
  };
  data: ISaldo;
} = {
  params: {
    group_id: "-1001745048540",
  },
  data: {
    total_saldo: 10212021,
    settled_saldo: 32192010,
    unsettled_saldo: 42148182,
  },
};

export const mockSaldoHistories: {
  params: ISaldoHistoriesParams;
  data: ISaldoHistories[];
} = {
  params: {
    group_id: "-1001745048540",
    page: 1,
    size: 10,
    sort: "newest",
  },
  data: [
    {
      id: "1",
      category: "fee",
      amount: 150.0,
      status: "settled",
      ref_id: "REF12345",
      timestamp: "2024-07-12T10:00:00Z",
      direction: TypeMutation.DEBIT,
      metadata: {
        invoice_number: "INV-001",
        invoice_date: "2024-07-10",
        payment_invoice_id: "PLINK123",
        bank_code: "Bank of Examples",
        account_number: "1234567890",
        account_holder_name: "John Doe",
      },
    },
    {
      id: "2",
      category: "withdrawal",
      amount: 500.0,
      status: "unsettled",
      ref_id: "REF67890",
      timestamp: "2024-07-11T14:30:00Z",
      direction: TypeMutation.DEBIT,
      metadata: {
        invoice_number: "INV-002",
        invoice_date: "2024-07-11",
        payment_invoice_id: "PLINK456",
        bank_code: "Example Bank",
        account_number: "0987654321",
        account_holder_name: "Jane Smith",
      },
    },
    {
      id: "3",
      category: "payment",
      amount: 300.0,
      status: "disbursed",
      ref_id: "REF54321",
      timestamp: "2024-07-12T08:15:00Z",
      direction: TypeMutation.CREDIT,
      metadata: {
        invoice_number: "INV-003",
        invoice_date: "2024-07-12",
        payment_invoice_id: "PLINK789",
        bank_code: "Bank of Mock",
        account_number: "1122334455",
        account_holder_name: "Alice Johnson",
      },
    },
    {
      id: "4",
      category: "fee",
      amount: 50.0,
      status: "hold",
      ref_id: "REF11223",
      timestamp: "2024-07-10T09:00:00Z",
      direction: TypeMutation.DEBIT,
      metadata: {
        invoice_number: "INV-004",
        invoice_date: "2024-07-09",
        payment_invoice_id: "PLINK012",
        bank_code: "Mock Bank",
        account_number: "6677889900",
        account_holder_name: "Bob Brown",
      },
    },
  ],
};

export const mockSaldoHistoriesSortOldest: {
  params: ISaldoHistoriesParams;
  data: ISaldoHistories[];
} = {
  params: {
    group_id: "-1001745048540",
    page: 1,
    size: 10,
    sort: "oldest",
  },
  data: [
    {
      id: "1",
      category: "fee",
      amount: 150.0,
      status: "settled",
      ref_id: "REF12345",
      timestamp: "2024-07-12T10:00:00Z",
      direction: "debit",
      metadata: {
        invoice_number: "INV-001",
        invoice_date: "2024-07-10",
        payment_invoice_id: "PLINK123",
        bank_code: "Bank of Examples",
        account_number: "1234567890",
        account_holder_name: "John Doe",
      },
    },
    {
      id: "2",
      category: "withdrawal",
      amount: 500.0,
      status: "unsettled",
      ref_id: "REF67890",
      timestamp: "2024-07-11T14:30:00Z",
      direction: "debit",
      metadata: {
        invoice_number: "INV-002",
        invoice_date: "2024-07-11",
        payment_invoice_id: "PLINK456",
        bank_code: "Example Bank",
        account_number: "0987654321",
        account_holder_name: "Jane Smith",
      },
    },
    {
      id: "3",
      category: "payment",
      amount: 300.0,
      status: "disbursed",
      ref_id: "REF54321",
      timestamp: "2024-07-12T08:15:00Z",
      direction: "credit",
      metadata: {
        invoice_number: "INV-003",
        invoice_date: "2024-07-12",
        payment_invoice_id: "PLINK789",
        bank_code: "Bank of Mock",
        account_number: "1122334455",
        account_holder_name: "Alice Johnson",
      },
    },
    {
      id: "4",
      category: "fee",
      amount: 50.0,
      status: "hold",
      ref_id: "REF11223",
      timestamp: "2024-07-10T09:00:00Z",
      direction: "debit",
      metadata: {
        invoice_number: "INV-004",
        invoice_date: "2024-07-09",
        payment_invoice_id: "PLINK012",
        bank_code: "Mock Bank",
        account_number: "6677889900",
        account_holder_name: "Bob Brown",
      },
    },
  ],
};
