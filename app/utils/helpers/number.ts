export const numberFormat = (value: string) => {
  if (!value) return value;

  const number = parseFloat(value);
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  return formatter.format(number);
};

export const cleanFormatNumber = (amount: string) => {
  if (!amount) return amount;

  return amount.toString().replace(/\D/g, "");
};
