
export interface JwtDecodedPart {
  raw: string;
  formatted: string;
  data: Record<string, unknown>;
}

export interface JwtClaim {
  name: string;
  value: string;
  description: string;
}

export interface JwtDecodeResult {
  header: JwtDecodedPart;
  payload: JwtDecodedPart;
  signature: string;
  claims: JwtClaim[];
  expiry: {
    exists: boolean;
    expired: boolean;
    date: string | null;
  };
  notBefore: {
    exists: boolean;
    active: boolean;
    date: string | null;
  };
}
