import type { HashAlgorithm } from "../types";

export async function generateHash(
  input: string,
  algorithm: HashAlgorithm
): Promise<string> {
  if (!input) {
    throw new Error("Enter some text before generating a hash.");
  }

  if (!globalThis.crypto?.subtle) {
    throw new Error(
      "Web Crypto API is unavailable. Use localhost or a secure HTTPS connection."
    );
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  const digest = await globalThis.crypto.subtle.digest(algorithm, data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getByteLength(input: string): number {
  return new TextEncoder().encode(input).length;
}