
"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  Hash,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";

import { generateUuids, validateUuid } from "../utils/uuid.utils";
import type { UuidCase, UuidCount } from "../types";
import styles from "./UuidWorkspace.module.css";

const countOptions: UuidCount[] = [1, 5, 10, 25, 50];

export default function UuidWorkspace() {
  const [count, setCount] = useState<UuidCount>(5);
  const [letterCase, setLetterCase] = useState<UuidCase>("lowercase");
  const [uuids, setUuids] = useState<string[]>([]);
  const [validationInput, setValidationInput] = useState("");
  const [validationResult, setValidationResult] = useState<ReturnType<
    typeof validateUuid
  > | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  function clearResults() {
    setUuids([]);
    setValidationResult(null);
    setError("");
    setCopied(null);
  }

  function generate() {
    try {
      const values = generateUuids(count, letterCase);
      setUuids(values);
      setError("");
      setCopied(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to generate UUIDs."
      );
    }
  }

  async function copyText(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setError("");
    } catch {
      setError("Unable to copy. Check your browser clipboard permissions.");
    }
  }

  function downloadResults() {
    if (uuids.length === 0) return;

    const blob = new Blob([uuids.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "codexcrew-uuids.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function validateInput() {
    if (!validationInput.trim()) {
      setValidationResult(null);
      return;
    }

    setValidationResult(validateUuid(validationInput));
  }

  function resetWorkspace() {
    setCount(5);
    setLetterCase("lowercase");
    setValidationInput("");
    clearResults();
  }

  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <Hash size={22} />
        </div>

        <div>
          <div className={styles.eyebrow}>DEVELOPER UTILITIES</div>
          <h2>UUID Generator</h2>
          <p>
            Generate secure UUID v4 identifiers in bulk and validate
            existing UUIDs.
          </p>
        </div>
      </div>

      <section className={styles.requestPanel}>
        <div className={styles.requestTop}>
          <div className={styles.requestLabel}>
            <Zap size={15} />
            GENERATOR CONFIGURATION
          </div>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.sampleButton}
              onClick={generate}
            >
              <RotateCcw size={13} />
              Generate
            </button>

            <button
              type="button"
              className={styles.sampleButton}
              onClick={resetWorkspace}
            >
              <Trash2 size={13} />
              Reset
            </button>
          </div>
        </div>

        <div className={styles.configBody}>
          <div className={styles.configGroup}>
            <label className={styles.configLabel}>QUANTITY</label>

            <div className={styles.countOptions}>
              {countOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`${styles.countButton} ${
                    count === option ? styles.activeOption : ""
                  }`}
                  onClick={() => setCount(option)}
                  aria-pressed={count === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.configGroup}>
            <label className={styles.configLabel}>LETTER CASE</label>

            <div className={styles.caseOptions}>
              <button
                type="button"
                className={`${styles.caseButton} ${
                  letterCase === "lowercase" ? styles.activeOption : ""
                }`}
                onClick={() => setLetterCase("lowercase")}
                aria-pressed={letterCase === "lowercase"}
              >
                abc
                <span>Lowercase</span>
              </button>

              <button
                type="button"
                className={`${styles.caseButton} ${
                  letterCase === "uppercase" ? styles.activeOption : ""
                }`}
                onClick={() => setLetterCase("uppercase")}
                aria-pressed={letterCase === "uppercase"}
              >
                ABC
                <span>Uppercase</span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.requestFooter}>
          <span>UUID version 4</span>
          <span>Cryptographically secure randomness</span>
        </div>

        <div className={styles.generateActions}>
          <span className={styles.generateHint}>
            <ShieldCheck size={13} />
            Generated locally in your browser.
          </span>

          <button
            type="button"
            className={styles.generateButton}
            onClick={generate}
          >
            <Zap size={14} />
            Generate {count} UUID{count > 1 ? "s" : ""}
          </button>
        </div>
      </section>

      <section className={styles.responsePanel}>
        <div className={styles.responseHeader}>
          <div className={styles.responseTitle}>
            <Hash size={15} />
            GENERATED OUTPUT
          </div>

          {uuids.length > 0 && (
            <div className={styles.responseStats}>
              <span className={styles.statusSuccess}>
                <Check size={12} />
                Generated
              </span>
              <span>{uuids.length} UUIDs</span>
            </div>
          )}
        </div>

        {error && (
          <div className={styles.errorBox} role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {uuids.length > 0 ? (
          <>
            <div className={styles.responseTabs}>
              <button className={styles.activeTab} type="button">
                UUID list ({uuids.length})
              </button>

              <div className={styles.responseActions}>
                <button
                  type="button"
                  onClick={() =>
                    copyText(uuids.join("\n"), "all")
                  }
                >
                  {copied === "all" ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}
                  {copied === "all" ? "Copied" : "Copy all"}
                </button>

                <button type="button" onClick={downloadResults}>
                  <Download size={13} />
                  Download
                </button>

                <button type="button" onClick={clearResults}>
                  <Trash2 size={13} />
                  Clear
                </button>
              </div>
            </div>

            <div className={styles.uuidList}>
              {uuids.map((uuid, index) => (
                <div className={styles.uuidRow} key={uuid}>
                  <span className={styles.uuidIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <code>{uuid}</code>

                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={() => copyText(uuid, uuid)}
                    aria-label={`Copy UUID ${index + 1}`}
                    title="Copy UUID"
                  >
                    {copied === uuid ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.responseFooter}>
              <span>UUID v4 · RFC variant</span>
              <span>{uuids.length} identifiers generated</span>
            </div>
          </>
        ) : (
          <div className={styles.emptyResponse}>
            <div className={styles.emptyIcon}>
              <Hash size={24} />
            </div>
            <strong>Your generated UUIDs will appear here.</strong>
            <span>Choose a quantity and select Generate UUIDs.</span>
          </div>
        )}
      </section>

      <section className={styles.validatorPanel}>
        <div className={styles.validatorHeader}>
          <div className={styles.requestLabel}>
            <ShieldCheck size={15} />
            UUID VALIDATOR
          </div>
        </div>

        <div className={styles.validatorBody}>
          <label htmlFor="uuid-validator" className={styles.configLabel}>
            UUID INPUT
          </label>

          <div className={styles.validatorInputRow}>
            <input
              id="uuid-validator"
              type="text"
              value={validationInput}
              onChange={(event) => {
                setValidationInput(event.target.value);
                setValidationResult(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") validateInput();
              }}
              placeholder="Paste a UUID to validate..."
              className={styles.validatorInput}
              spellCheck={false}
              autoComplete="off"
            />

            {validationInput && (
              <button
                type="button"
                className={styles.clearInputButton}
                onClick={() => {
                  setValidationInput("");
                  setValidationResult(null);
                }}
                aria-label="Clear input"
              >
                <Trash2 size={14} />
              </button>
            )}

            <button
              type="button"
              className={styles.validateButton}
              onClick={validateInput}
              disabled={!validationInput.trim()}
            >
              Validate
            </button>
          </div>

          {validationResult && (
            <div
              className={`${styles.validationResult} ${
                validationResult.isValid
                  ? styles.validationSuccess
                  : styles.validationError
              }`}
              role="status"
            >
              {validationResult.isValid ? (
                <Check size={16} />
              ) : (
                <AlertCircle size={16} />
              )}

              <div>
                <strong>
                  {validationResult.isValid
                    ? "Valid UUID format"
                    : "Invalid UUID"}
                </strong>

                <p>
                  {validationResult.isValid
                    ? `${validationResult.version} · ${validationResult.variant}`
                    : "Expected a UUID with the standard 8-4-4-4-12 hexadecimal format."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.validatorFooter}>
          <span>Format validation only</span>
          <span>Processed locally</span>
        </div>
      </section>

      <div className={styles.privacyNote}>
        <ShieldCheck size={13} />
        UUIDs are generated locally using cryptographically secure browser
        randomness. Validation checks the UUID format, not whether it exists
        in a database.
      </div>
    </div>
  );
}
