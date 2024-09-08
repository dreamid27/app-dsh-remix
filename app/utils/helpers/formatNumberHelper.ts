export const formatCurrency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export const formatNumberEN = new Intl.NumberFormat("en-EN");

export const formatNumber = new Intl.NumberFormat("en-ID");

export const formatCurrencyWithoutComma = (num: number | string): string => {
  // Convert input to a number
  const numValue =
    typeof num === "string" ? Number(num.replace(/\D/g, "")) : num;

  // Check if the conversion resulted in a valid number
  if (isNaN(numValue)) {
    return "Invalid input";
  }

  // Format the number and remove the last 3 characters (decimal separator and cents)
  return formatCurrency.format(Math.floor(numValue)).slice(0, -3);
};

export const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value);
};

export function roundNumber(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export const formatNumberSimplified = (num: number): string => {
  const ONE_BILLION = 1000000000;
  const ONE_MILLION = 1000000;
  const ONE_THOUSAND = 1000;

  if (Math.abs(num) >= ONE_BILLION) {
    if (Math.abs(num) % ONE_BILLION != 0) {
      return `${(num / ONE_BILLION).toFixed(2)} M`;
    }
    return `${Math.floor(num / ONE_BILLION)} M`;
  }

  if (Math.abs(num) >= ONE_MILLION) {
    if (Math.abs(num) % ONE_MILLION != 0) {
      return `${(num / ONE_MILLION).toFixed(2)} jt`;
    }
    return `${Math.floor(num / ONE_MILLION)} jt`;
  }

  return `${parseFloat((num / ONE_THOUSAND).toFixed(2))} rb`;
};
