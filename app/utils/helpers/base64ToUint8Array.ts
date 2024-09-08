export default function base64ToUint8Array(base64String: string) {
  // Decode base64 string to binary
  const binaryString = atob(base64String);

  // Create Uint8Array and fill it with character codes
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return uint8Array;
}
