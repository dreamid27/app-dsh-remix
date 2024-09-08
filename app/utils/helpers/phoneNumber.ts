const formatPhoneNumber = (inputPhone: string) => {
  if (!inputPhone) return null;

  if (inputPhone.charAt(0) === "0") return inputPhone.substring(1);

  return inputPhone;
};
export default formatPhoneNumber;
