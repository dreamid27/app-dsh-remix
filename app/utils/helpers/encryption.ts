import crypto from "crypto";

const { SECRET_KEY, SECRET_IV, ENCRYPTION_METHOD } = process.env;

if (!SECRET_KEY || !SECRET_IV || !ENCRYPTION_METHOD) {
  throw new Error("secretKey, secretIV, and ecnryptionMethod are required");
}

const key = crypto
  .createHash("sha512")
  .update(SECRET_KEY)
  .digest("hex")
  .substring(0, 32);

const encryptionIV = crypto
  .createHash("sha512")
  .update(SECRET_IV)
  .digest("hex")
  .substring(0, 16);

// Encrypt data
export function encryptData(data: string) {
  const cipher = crypto.createCipheriv(ENCRYPTION_METHOD as string, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64"); // Encrypts data and converts to hex and base64
}

// Decrypt data
export function decryptData(encryptedData: string) {
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_METHOD as string,
    key,
    encryptionIV
  );
  const decrypted =
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8"); // Decrypts data and converts to utf8
  return decrypted;
}
