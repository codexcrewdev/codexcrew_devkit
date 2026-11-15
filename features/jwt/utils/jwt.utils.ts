
import type {
  JwtClaim,
  JwtDecodeResult,
  JwtDecodedPart,
} from "../types";

function decodeBase64Url(value: string): string {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );

  const binary = atob(padded);

  const bytes = Uint8Array.from(binary, (char) =>
    char.charCodeAt(0)
  );

  return new TextDecoder("utf-8", {
    fatal: true,
  }).decode(bytes);
}

function decodeJsonPart(value: string): JwtDecodedPart {
  const raw = decodeBase64Url(value);
  const parsed: unknown = JSON.parse(raw);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error(
      "JWT header and payload must be JSON objects."
    );
  }

  const data = parsed as Record<string, unknown>;

  return {
    raw,
    formatted: JSON.stringify(data, null, 2),
    data,
  };
}

function formatClaimValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function getDateFromClaim(
  value: unknown
): { timestamp: number; date: string } | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  const date = new Date(value * 1000);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    timestamp: value,
    date: date.toLocaleString(),
  };
}

function buildClaims(
  payload: Record<string, unknown>
): JwtClaim[] {
  const descriptions: Record<string, string> = {
    iss: "Issuer — who issued the token",
    sub: "Subject — who the token refers to",
    aud: "Audience — intended recipient",
    exp: "Expiration time",
    nbf: "Not valid before this time",
    iat: "Issued at time",
    jti: "JWT ID — unique token identifier",
  };

  return Object.entries(payload)
    .filter(([name]) =>
      Object.prototype.hasOwnProperty.call(descriptions, name)
    )
    .map(([name, value]) => {
      let formattedValue = formatClaimValue(value);

      if (
        ["exp", "nbf", "iat"].includes(name) &&
        typeof value === "number"
      ) {
        const date = getDateFromClaim(value);

        if (date) {
          formattedValue = `${date.date} (${value})`;
        }
      }

      return {
        name,
        value: formattedValue,
        description: descriptions[name],
      };
    });
}

export function decodeJwt(token: string): JwtDecodeResult {
  const trimmedToken = token.trim();

  if (!trimmedToken) {
    throw new Error("Paste a JWT to decode.");
  }

  const parts = trimmedToken.split(".");

  if (parts.length !== 3) {
    throw new Error(
      "Invalid JWT structure. A JWT must contain three parts separated by dots."
    );
  }

  const [
    encodedHeader,
    encodedPayload,
    encodedSignature,
  ] = parts;

  if (!encodedHeader || !encodedPayload) {
    throw new Error(
      "The JWT header or payload is empty. Check that you pasted the complete token."
    );
  }

  if (
    !/^[A-Za-z0-9_-]+$/.test(encodedHeader) ||
    !/^[A-Za-z0-9_-]+$/.test(encodedPayload) ||
    (
      encodedSignature !== "" &&
      !/^[A-Za-z0-9_-]+$/.test(encodedSignature)
    )
  ) {
    throw new Error(
      "The JWT contains invalid Base64URL characters."
    );
  }

  let header: JwtDecodedPart;
  let payload: JwtDecodedPart;

  try {
    header = decodeJsonPart(encodedHeader);
  } catch {
    throw new Error(
      "Could not decode the JWT header. The first section must contain valid Base64URL-encoded JSON."
    );
  }

  try {
    payload = decodeJsonPart(encodedPayload);
  } catch {
    throw new Error(
      "Could not decode the JWT payload. The second section must contain valid Base64URL-encoded JSON."
    );
  }

  const now = Math.floor(Date.now() / 1000);

  const expiryDate = getDateFromClaim(payload.data.exp);
  const notBeforeDate = getDateFromClaim(payload.data.nbf);

  return {
    header,
    payload,
    signature: encodedSignature,
    claims: buildClaims(payload.data),

    expiry: {
      exists: expiryDate !== null,
      expired:
        expiryDate !== null &&
        now >= expiryDate.timestamp,
      date: expiryDate?.date ?? null,
    },

    notBefore: {
      exists: notBeforeDate !== null,
      active:
        notBeforeDate !== null &&
        now >= notBeforeDate.timestamp,
      date: notBeforeDate?.date ?? null,
    },
  };
}
