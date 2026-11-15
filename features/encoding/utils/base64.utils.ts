
import type {
  Base64Action,
  Base64Result,
} from "../base64.types";

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);

    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }

  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const normalized = value.replace(/\s/g, "");

  if (!normalized) {
    throw new Error("Enter some Base64 text to decode.");
  }

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error("Invalid Base64 characters detected.");
  }

  if (normalized.length % 4 !== 0) {
    throw new Error("Invalid Base64 length. Check your input.");
  }

  const binary = atob(normalized);

  return Uint8Array.from(binary, (character) =>
    character.charCodeAt(0)
  );
}

export function processBase64(
  input: string,
  action: Base64Action
): Base64Result {
  if (!input.trim()) {
    throw new Error(
      action === "encode"
        ? "Enter some text to encode."
        : "Enter some Base64 text to decode."
    );
  }

  let output: string;
  let inputBytes: number;

  if (action === "encode") {
    const bytes = new TextEncoder().encode(input);

    output = bytesToBase64(bytes);
    inputBytes = bytes.length;
  } else {
    try {
      const bytes = base64ToBytes(input);
      const decoder = new TextDecoder("utf-8", { fatal: true });

      output = decoder.decode(bytes);
      inputBytes = bytes.length;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Base64")) {
        throw error;
      }

      throw new Error(
        "Unable to decode this input. It may contain invalid Base64 or invalid UTF-8 data."
      );
    }
  }

  return {
    output,
    inputLength: input.length,
    outputLength: output.length,
    inputBytes,
    action,
  };
}
