import type {
  UuidCase,
  UuidValidationResult,
} from "../types";

function formatUuid(uuid: string, letterCase: UuidCase): string {
  return letterCase === "uppercase"
    ? uuid.toUpperCase()
    : uuid.toLowerCase();
}

function createSecureUuid(): string {
  if (typeof crypto === "undefined") {
    throw new Error(
      "Secure random generation is not supported in this browser."
    );
  }

  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  if (typeof crypto.getRandomValues !== "function") {
    throw new Error(
      "Your browser does not support secure random number generation."
    );
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set UUID version to 4.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;

  // Set the RFC 4122 variant.
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  );

  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

export function generateUuids(
  count: number,
  letterCase: UuidCase
): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("Choose a quantity between 1 and 50.");
  }

  return Array.from({ length: count }, () =>
    formatUuid(createSecureUuid(), letterCase)
  );
}

export function validateUuid(
  value: string
): UuidValidationResult {
  const normalized = value.trim();

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;

  const match = normalized.match(uuidRegex);

  if (!match) {
    return {
      value: normalized,
      isValid: false,
      version: null,
      variant: null,
    };
  }

  return {
    value: normalized,
    isValid: true,
    version: `Version ${match[1]}`,
    variant: "RFC 4122 / RFC 9562 variant",
  };
}