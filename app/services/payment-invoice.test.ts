import httpClient from "utils/providers/dataProvider";
import mock from "utils/test/axiosMock";
import { describe, expect, it } from "vitest";
import { getPaymentLink, IPaymentLink } from "./payment-invoice";
import {
  mockDataPaymentLink,
  mockDataPaymentLinkPending,
} from "./payment-invoice.mocks";

const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

describe("Payment Link Services", () => {
  it("should fetch payment links correctly", async () => {
    mock
      .onGet(`${API_URL}/payments/payment-invoice`, {
        params: mockDataPaymentLink.params,
      })
      .reply(200, mockDataPaymentLink.data);

    const result = await getPaymentLink(httpClient, mockDataPaymentLink.params);

    expect(result).toEqual(mockDataPaymentLink.data);
    expect(result.length).toEqual(mockDataPaymentLink.data.length);

    //expect first data
    const firstData = result[0];
    expect(firstData).toEqual(mockDataPaymentLink.data[0]);
  });

  it("should fetch payment links correctly with pending statuses", async () => {
    mock
      .onGet(`${API_URL}/payments/payment-invoice`, {
        params: mockDataPaymentLinkPending.params,
      })
      .reply(200, mockDataPaymentLinkPending.data);

    const result = await getPaymentLink(
      httpClient,
      mockDataPaymentLinkPending.params
    );

    expect(result).toEqual(mockDataPaymentLinkPending.data);
    expect(result.length).toEqual(mockDataPaymentLinkPending.data.length);

    //expect first data
    const firstData = result[0];
    expect(firstData).toEqual(mockDataPaymentLinkPending.data[0]);
  });
});
