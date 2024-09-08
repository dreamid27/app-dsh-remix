export const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

export const formatExpiryDate = (value: string) => {
  // Remove non-numeric characters
  const numericValue = value.replace(/\D/g, "");

  // Limit to four numeric characters
  const formattedValue = numericValue.slice(0, 4);

  // Add the '/' separator after the first two characters
  if (formattedValue.length > 2) {
    return formattedValue.slice(0, 2) + " / " + formattedValue.slice(2);
  } else {
    return formattedValue;
  }
};
