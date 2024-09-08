const getLabelPaymentLink = () => {
  if (typeof window !== "undefined") {
    // Check for a cookie or flag to determine which text to use
    const useInvoiceText =
      window.localStorage.getItem("useInvoiceText") === "true";
    return useInvoiceText ? "Payment Invoice" : "Payment Link";
  }

  return "Payment Link";
};

export default getLabelPaymentLink;
