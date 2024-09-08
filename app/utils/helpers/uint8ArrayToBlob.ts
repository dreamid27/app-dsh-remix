export default function uint8ArrayToBlob(
  uint8Array: Uint8Array,
  mimeType?: string
) {
  // Create a Blob from the Uint8Array
  return new Blob([uint8Array], {
    type: mimeType || "application/octet-stream",
  });
}
