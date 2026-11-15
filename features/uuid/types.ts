export type UuidCase = "lowercase" | "uppercase";

export type UuidCount = 1 | 5 | 10 | 25 | 50;

export interface UuidValidationResult {
  value: string;
  isValid: boolean;
  version: string | null;
  variant: string | null;
}