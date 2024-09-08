import NodeRSA from "encrypt-rsa";

const nodeRSA = new NodeRSA();

export function encryptDataAsymmetric(data: string) {
  return nodeRSA.encryptStringWithRsaPublicKey({
    text: data,
    publicKey: process.env.NEXT_PUBLIC_NODE_RSA_PUBLIC_KEY?.split(
      String.raw`\n`
    ).join("\n"),
  });
}
