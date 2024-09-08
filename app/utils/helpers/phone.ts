export function cleanPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/^\+62\s?0/, "");
  //return +62 89999999 to 89999999
}

export function formatPhoneNumber(number: string | number) {
  if (!number) return;

  // Remove any non-digit characters from the number
  number = number.toString().replace(/\D/g, "");

  // Check the length of the number and apply formatting accordingly
  if (number.startsWith("0")) {
    // Numbers starting with '0' and length 11 are assumed to be Indonesian numbers
    number = "+62" + number.slice(1);
  } else if (number.startsWith("62")) {
    // Numbers starting with '62' and length 12 are assumed to be Indonesian numbers without the leading '0'
    number = "+" + number;
  } else {
    number = "+62" + number;
  }

  //return +6281910373275
  return number;
}
