import type {
  TimestampConversionResult,
  TimestampUnit,
} from "../types";

function getValidDate(timestamp: number): Date {
  if (!Number.isFinite(timestamp)) {
    throw new Error("Enter a valid numeric timestamp.");
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    throw new Error("This timestamp is outside the supported date range.");
  }

  return date;
}

export function timestampToDate(
  value: string,
  unit: TimestampUnit
): TimestampConversionResult {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("Enter a Unix timestamp to convert.");
  }

  const numericValue = Number(trimmed);

  if (!Number.isFinite(numericValue)) {
    throw new Error("Enter a valid numeric timestamp.");
  }

  const milliseconds =
    unit === "seconds" ? numericValue * 1000 : numericValue;

  const date = getValidDate(milliseconds);

  return {
    timestamp: numericValue,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    seconds: Math.floor(date.getTime() / 1000),
    milliseconds: date.getTime(),
  };
}

export function dateToTimestamp(
  value: string
): TimestampConversionResult {
  if (!value.trim()) {
    throw new Error("Choose a date and time to convert.");
  }

  const milliseconds = new Date(value).getTime();

  if (!Number.isFinite(milliseconds)) {
    throw new Error("Enter a valid date and time.");
  }

  const date = getValidDate(milliseconds);

  return {
    timestamp: milliseconds,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
  };
}

export function getCurrentTimestamp() {
  const milliseconds = Date.now();

  return {
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
  };
}

export function formatTimestamp(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}