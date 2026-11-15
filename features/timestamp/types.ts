export type TimestampMode = "to-date" | "to-timestamp";
export type TimestampUnit = "seconds" | "milliseconds";

export interface TimestampConversionResult {
  timestamp: number;
  iso: string;
  utc: string;
  local: string;
  seconds: number;
  milliseconds: number;
}