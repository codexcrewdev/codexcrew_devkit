
"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  Check,
  Copy,
  Download,
  FileJson,
  FileSpreadsheet,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";

import {
  convertCsvToJson,
  convertJsonToCsv,
} from "../utils/csv-json.utils";

import type {
  ConversionMode,
  ConversionResult,
  CsvDelimiter,
} from "../types";

import styles from "./CsvJsonWorkspace.module.css";

const csvSample = `name,email,role
John Doe,john@example.com,Developer
Jane Smith,jane@example.com,Designer
Alex Brown,alex@example.com,Manager`;

const jsonSample = [
  {
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Designer",
  },
  {
    name: "Alex Brown",
    email: "alex@example.com",
    role: "Manager",
  },
];

export default function CsvJsonWorkspace() {
  const [mode, setMode] = useState<ConversionMode>("csv-to-json");
  const [delimiter, setDelimiter] = useState<CsvDelimiter>("auto");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const isCsvToJson = mode === "csv-to-json";

  function clearResult() {
    setResult(null);
    setError("");
    setCopied(false);
  }

  function handleModeChange(nextMode: ConversionMode) {
    setMode(nextMode);
    setInput("");
    clearResult();
  }

  function handleSample() {
    setInput(
      isCsvToJson
        ? csvSample
        : JSON.stringify(jsonSample, null, 2)
    );
    clearResult();
  }

  function handleConvert() {
    try {
      const converted = isCsvToJson
        ? convertCsvToJson(input, delimiter)
        : convertJsonToCsv(input);

      setResult(converted);
      setError("");
      setCopied(false);
    } catch (err) {
      setResult(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to convert this data."
      );
    }
  }

  async function handleCopy() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setError("");
    } catch {
      setError("Unable to copy. Check your browser clipboard permissions.");
    }
  }

  function handleDownload() {
    if (!result) return;

    const extension = isCsvToJson ? "json" : "csv";
    const mimeType = isCsvToJson
      ? "application/json;charset=utf-8"
      : "text/csv;charset=utf-8";

    const blob = new Blob([result.output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `codexcrew-converted.${extension}`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handleSwap() {
    if (!result) return;

    setInput(result.output);
    setMode(isCsvToJson ? "json-to-csv" : "csv-to-json");
    clearResult();
  }

  function handleReset() {
    setInput("");
    setDelimiter("auto");
    clearResult();
  }

  return (
    <main className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <FileSpreadsheet size={22} />
        </div>

        <div className={styles.introContent}>
          <div className={styles.eyebrow}>DEVELOPER UTILITIES</div>
          <h1>CSV ↔ JSON Converter</h1>
          <p>
            Convert CSV data into JSON and JSON arrays into clean CSV files.
          </p>
        </div>
      </div>

      <section className={styles.requestPanel}>
        <div className={styles.requestTop}>
          <div className={styles.requestLabel}>
            <Zap size={15} />
            CONVERSION WORKSPACE
          </div>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.sampleButton}
              onClick={handleSample}
            >
              <FileJson size={13} />
              Sample
            </button>

            <button
              type="button"
              className={styles.sampleButton}
              onClick={handleReset}
            >
              <Trash2 size={13} />
              Clear
            </button>
          </div>
        </div>

        <div className={styles.modeTabs}>
          <button
            type="button"
            className={`${styles.modeTab} ${
              isCsvToJson ? styles.modeTabActive : ""
            }`}
            onClick={() => handleModeChange("csv-to-json")}
            aria-pressed={isCsvToJson}
          >
            <FileSpreadsheet size={14} />
            CSV to JSON
          </button>

          <button
            type="button"
            className={`${styles.modeTab} ${
              !isCsvToJson ? styles.modeTabActive : ""
            }`}
            onClick={() => handleModeChange("json-to-csv")}
            aria-pressed={!isCsvToJson}
          >
            <FileJson size={14} />
            JSON to CSV
          </button>
        </div>

        <div className={styles.editorSection}>
          <div className={styles.editorHeader}>
            <label htmlFor="converter-input" className={styles.inputLabel}>
              {isCsvToJson ? "CSV INPUT" : "JSON INPUT"}
            </label>

            <span className={styles.formatBadge}>
              {isCsvToJson ? "CSV" : "JSON"}
            </span>
          </div>

          <textarea
            id="converter-input"
            className={styles.editor}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              clearResult();
            }}
            placeholder={
              isCsvToJson
                ? "name,email,role\nJohn Doe,john@example.com,Developer"
                : '[\n  {\n    "name": "John Doe",\n    "email": "john@example.com"\n  }\n]'
            }
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
          />

          <div className={styles.editorFooter}>
            <span>
              {input.length.toLocaleString()} characters
            </span>
            <span>
              {input.trim() ? input.split(/\r\n|\r|\n/).length : 0} lines
            </span>
          </div>
        </div>

        {isCsvToJson && (
          <div className={styles.optionsSection}>
            <div className={styles.optionsHeading}>
              <span className={styles.inputLabel}>CSV DELIMITER</span>
              <span className={styles.optionHint}>
                Auto-detect recommended
              </span>
            </div>

            <div className={styles.delimiterOptions}>
              {(
                [
                  { value: "auto", label: "Auto" },
                  { value: ",", label: "Comma ," },
                  { value: ";", label: "Semicolon ;" },
                  { value: "\t", label: "Tab" },
                  { value: "|", label: "Pipe |" },
                ] as { value: CsvDelimiter; label: string }[]
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.delimiterButton} ${
                    delimiter === option.value
                      ? styles.delimiterActive
                      : ""
                  }`}
                  onClick={() => {
                    setDelimiter(option.value);
                    clearResult();
                  }}
                  aria-pressed={delimiter === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
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
            disabled={!input.trim()}
          >
            <Zap size={14} />
            Convert
          </button>
        </div>
      </section>

      {error && (
        <div className={styles.errorBox} role="alert">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      <section className={styles.responsePanel}>
        <div className={styles.responseHeader}>
          <div className={styles.responseTitle}>
            <FileJson size={15} />
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

        {result ? (
          <>
            <div className={styles.resultSummary}>
              <div className={styles.summaryIcon}>
                <Check size={16} />
              </div>

              <div className={styles.summaryContent}>
                <span>CONVERSION SUCCESSFUL</span>
                <strong>
                  {result.rows} rows · {result.columns} columns
                </strong>
              </div>
            </div>

            <div className={styles.responseTabs}>
              <span className={styles.activeTab}>
                {isCsvToJson ? "JSON output" : "CSV output"}
              </span>

              <div className={styles.responseActions}>
                <button type="button" onClick={handleSwap}>
                  <ArrowLeftRight size={13} />
                  Swap
                </button>

                <button type="button" onClick={handleCopy}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>

                <button type="button" onClick={handleDownload}>
                  <Download size={13} />
                  Download
                </button>
              </div>
            </div>

            <textarea
              className={styles.outputEditor}
              value={result.output}
              readOnly
              spellCheck={false}
              aria-label="Conversion output"
            />

            <div className={styles.responseFooter}>
              <span>
                {isCsvToJson ? "JSON format" : "CSV format"}
              </span>
              <span>
                {result.output.length.toLocaleString()} characters
              </span>
            </div>
          </>
        ) : (
          <div className={styles.emptyResponse}>
            <div className={styles.emptyIcon}>
              <FileJson size={24} />
            </div>

            <strong>Your converted data will appear here.</strong>
            <span>
              Enter your data and click Convert to get started.
            </span>
          </div>
        )}
      </section>

      <div className={styles.privacyNote}>
        <ShieldCheck size={13} />
        <p>
          <strong>Privacy first.</strong> CSV and JSON conversion happens
          locally in your browser. Your data is never uploaded to a server.
        </p>
      </div>
    </main>
  );
}
