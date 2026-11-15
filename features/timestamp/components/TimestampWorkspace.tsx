
"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeftRight,
  Check,
  Clock3,
  Copy,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";

import {
  dateToTimestamp,
  formatTimestamp,
  getCurrentTimestamp,
  timestampToDate,
} from "../utils/timestamp.utils";

import type {
  TimestampConversionResult,
  TimestampMode,
  TimestampUnit,
} from "../types";

import styles from "./TimestampWorkspace.module.css";

function getLocalDateTimeValue() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function TimestampWorkspace() {
  const [mode, setMode] = useState<TimestampMode>("to-date");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  const [result, setResult] =
    useState<TimestampConversionResult | null>(null);

  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState({
    seconds: 0,
    milliseconds: 0,
  });

  useEffect(() => {
    setCurrentTime(getCurrentTimestamp());
  }, []);

  const resetResult = () => {
    setResult(null);
    setError("");
    setCopied(null);
  };

  const handleConvert = () => {
    try {
      const converted =
        mode === "to-date"
          ? timestampToDate(timestampInput, unit)
          : dateToTimestamp(dateInput);

      setResult(converted);
      setError("");
      setCopied(null);
    } catch (err) {
      setResult(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to convert this value."
      );
    }
  };

  const handleModeChange = (nextMode: TimestampMode) => {
    setMode(nextMode);
    setTimestampInput("");
    setDateInput("");
    resetResult();
  };

  const handleUseCurrent = () => {
    const current = getCurrentTimestamp();

    setCurrentTime(current);
    setMode("to-date");
    setUnit("seconds");
    setTimestampInput(String(current.seconds));
    setDateInput("");
    resetResult();
  };

  const handleUseCurrentDate = () => {
    setMode("to-timestamp");
    setDateInput(getLocalDateTimeValue());
    setTimestampInput("");
    resetResult();
  };

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setError("");
    } catch {
      setError("Unable to copy. Check your browser clipboard permissions.");
    }
  };

  const handleReset = () => {
    setTimestampInput("");
    setDateInput("");
    setUnit("seconds");
    resetResult();
  };

  const handleRefreshCurrent = () => {
    setCurrentTime(getCurrentTimestamp());
  };

  const outputRows = result
    ? [
        { label: "ISO 8601", value: result.iso, key: "iso" },
        { label: "UTC", value: result.utc, key: "utc" },
        { label: "Local time", value: result.local, key: "local" },
        {
          label: "Unix seconds",
          value: String(result.seconds),
          key: "seconds",
        },
        {
          label: "Unix milliseconds",
          value: String(result.milliseconds),
          key: "milliseconds",
        },
      ]
    : [];

  return (
    <main className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <Clock3 size={22} />
        </div>

        <div className={styles.introContent}>
          <div className={styles.eyebrow}>DEVELOPER UTILITIES</div>
          <h1>Timestamp Converter</h1>
          <p>
            Convert Unix timestamps into readable dates and dates into
            Unix timestamps.
          </p>
        </div>
      </div>

      {/* Current timestamp */}
      <section className={styles.currentPanel}>
        <div className={styles.currentInfo}>
          <div className={styles.currentIcon}>
            <Zap size={16} />
          </div>

          <div className={styles.currentContent}>
            <span className={styles.panelLabel}>
              CURRENT UNIX TIMESTAMP
            </span>

            <div className={styles.currentValue}>
              {currentTime.seconds
                ? formatTimestamp(currentTime.seconds)
                : "Loading..."}
            </div>

            <span className={styles.currentSubValue}>
              {currentTime.milliseconds
                ? `${formatTimestamp(currentTime.milliseconds)} milliseconds`
                : " "}
            </span>
          </div>
        </div>

        <button
          type="button"
          className={styles.currentButton}
          onClick={handleRefreshCurrent}
        >
          <RotateCcw size={13} />
          Refresh
        </button>
      </section>

      {/* Converter */}
      <section className={styles.requestPanel}>
        <div className={styles.requestTop}>
          <div className={styles.requestLabel}>
            <Clock3 size={15} />
            TIMESTAMP CONVERTER
          </div>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.sampleButton}
              onClick={handleReset}
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </div>

        <div className={styles.modeTabs}>
          <button
            type="button"
            className={`${styles.modeTab} ${
              mode === "to-date" ? styles.modeTabActive : ""
            }`}
            onClick={() => handleModeChange("to-date")}
            aria-pressed={mode === "to-date"}
          >
            <ArrowDown size={14} />
            Timestamp to Date
          </button>

          <button
            type="button"
            className={`${styles.modeTab} ${
              mode === "to-timestamp" ? styles.modeTabActive : ""
            }`}
            onClick={() => handleModeChange("to-timestamp")}
            aria-pressed={mode === "to-timestamp"}
          >
            <ArrowLeftRight size={14} />
            Date to Timestamp
          </button>
        </div>

        {mode === "to-date" ? (
          <div className={styles.inputSection}>
            <div className={styles.inputHeading}>
              <label
                htmlFor="timestamp-input"
                className={styles.inputLabel}
              >
                UNIX TIMESTAMP
              </label>

              <button
                type="button"
                className={styles.textAction}
                onClick={handleUseCurrent}
              >
                Use current timestamp
              </button>
            </div>

            <input
              id="timestamp-input"
              type="text"
              inputMode="decimal"
              value={timestampInput}
              onChange={(event) => {
                setTimestampInput(event.target.value);
                resetResult();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleConvert();
              }}
              placeholder="e.g. 1735689600"
              className={styles.textInput}
              spellCheck={false}
              autoComplete="off"
            />

            <div className={styles.unitSection}>
              <span className={styles.inputLabel}>
                TIMESTAMP UNIT
              </span>

              <div className={styles.unitOptions}>
                <button
                  type="button"
                  className={`${styles.unitButton} ${
                    unit === "seconds" ? styles.unitButtonActive : ""
                  }`}
                  onClick={() => {
                    setUnit("seconds");
                    resetResult();
                  }}
                  aria-pressed={unit === "seconds"}
                >
                  Seconds
                  <span>10 digits</span>
                </button>

                <button
                  type="button"
                  className={`${styles.unitButton} ${
                    unit === "milliseconds"
                      ? styles.unitButtonActive
                      : ""
                  }`}
                  onClick={() => {
                    setUnit("milliseconds");
                    resetResult();
                  }}
                  aria-pressed={unit === "milliseconds"}
                >
                  Milliseconds
                  <span>13 digits</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.inputSection}>
            <div className={styles.inputHeading}>
              <label htmlFor="date-input" className={styles.inputLabel}>
                DATE AND TIME
              </label>

              <button
                type="button"
                className={styles.textAction}
                onClick={handleUseCurrentDate}
              >
                Use current date
              </button>
            </div>

            <input
              id="date-input"
              type="datetime-local"
              value={dateInput}
              onChange={(event) => {
                setDateInput(event.target.value);
                resetResult();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleConvert();
              }}
              className={styles.textInput}
            />

            <p className={styles.inputHint}>
              The selected date and time will be interpreted in your
              browser&apos;s local timezone.
            </p>
          </div>
        )}

        <div className={styles.requestFooter}>
          <span>
            <ShieldCheck size={13} />
            Processed locally in your browser
          </span>

          <button
            type="button"
            className={styles.convertButton}
            onClick={handleConvert}
          >
            <Zap size={14} />
            Convert
          </button>
        </div>
      </section>

      {/* Output */}
      <section className={styles.responsePanel}>
        <div className={styles.responseHeader}>
          <div className={styles.responseTitle}>
            <Clock3 size={15} />
            CONVERSION OUTPUT
          </div>

          {result && (
            <div className={styles.responseStats}>
              <span className={styles.statusSuccess}>
                <Check size={12} />
                Converted
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className={styles.errorBox} role="alert">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {result ? (
          <>
            <div className={styles.resultSummary}>
              <div className={styles.summaryIcon}>
                <Check size={16} />
              </div>

              <div className={styles.summaryContent}>
                <span>CONVERSION SUCCESSFUL</span>
                <strong>{result.iso}</strong>
              </div>
            </div>

            <div className={styles.responseTabs}>
              <span className={styles.activeTab}>
                Conversion result
              </span>

              <div className={styles.responseActions}>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      outputRows
                        .map((row) => `${row.label}: ${row.value}`)
                        .join("\n"),
                      "all"
                    )
                  }
                >
                  {copied === "all" ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}
                  {copied === "all" ? "Copied" : "Copy all"}
                </button>
              </div>
            </div>

            <div className={styles.outputList}>
              {outputRows.map((row) => (
                <div className={styles.outputRow} key={row.key}>
                  <span className={styles.outputLabel}>
                    {row.label}
                  </span>

                  <code className={styles.outputValue}>
                    {row.value}
                  </code>

                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={() => handleCopy(row.value, row.key)}
                    aria-label={`Copy ${row.label}`}
                    title={`Copy ${row.label}`}
                  >
                    {copied === row.key ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.responseFooter}>
              <span>Unix timestamp conversion</span>
              <span>5 output formats</span>
            </div>
          </>
        ) : (
          <div className={styles.emptyResponse}>
            <div className={styles.emptyIcon}>
              <Clock3 size={24} />
            </div>

            <strong>Your conversion result will appear here.</strong>
            <span>
              Enter a timestamp or date and click Convert.
            </span>
          </div>
        )}
      </section>

      <div className={styles.privacyNote}>
        <ShieldCheck size={13} />
        <p>
          <strong>Privacy first.</strong> All conversions happen locally
          in your browser. Your input is never sent to a server. Local
          time is based on your browser&apos;s timezone.
        </p>
      </div>
    </main>
  );
}
