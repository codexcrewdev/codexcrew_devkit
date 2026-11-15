
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  Check,
  Copy,
  Download,
  Binary,
  RotateCcw,
  Trash2,
  Zap,
} from "lucide-react";

import { processBase64 } from "../utils/base64.utils";
import type {
  Base64Action,
  Base64Result,
} from "../base64.types";
import styles from "./Base64Workspace.module.css";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>Loading editor...</div>
  ),
});

const SAMPLE_TEXT =
  "CodeXcrew DevKit - Developer tools. Simplified. 🚀";

export default function Base64Workspace() {
  const [action, setAction] = useState<Base64Action>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [result, setResult] = useState<Base64Result | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function resetResult() {
    setOutput("");
    setResult(null);
    setError("");
    setCopied(false);
  }

  function handleInputChange(value: string) {
    setInput(value);
    resetResult();
  }

  function handleActionChange(nextAction: Base64Action) {
    setAction(nextAction);
    resetResult();
  }

  function loadSample() {
    setInput(
      action === "encode"
        ? SAMPLE_TEXT
        : "Q29kZVhjd2V3IERldktpdCAtIERldmVsb3BlciB0b29scy4gU2ltcGxpZmllZC4g8J+agA=="
    );
    resetResult();
  }

  function clearWorkspace() {
    setInput("");
    resetResult();
  }

  function handleProcess() {
    resetResult();

    try {
      const processed = processBase64(input, action);

      setOutput(processed.output);
      setResult(processed);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process this input."
      );
    }
  }

  function swapContent() {
    if (!output) return;

    setInput(output);
    setAction((current) =>
      current === "encode" ? "decode" : "encode"
    );
    resetResult();
  }

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Unable to copy the output. Please copy it manually.");
    }
  }

  function downloadOutput() {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = `codexcrew-base64-${action === "encode" ? "encoded" : "decoded"}.txt`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  const inputBytes = new TextEncoder().encode(input).length;
  const outputBytes = new TextEncoder().encode(output).length;

  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <Binary size={22} />
        </div>

        <div className={styles.introContent}>
          <div className={styles.eyebrow}>ENCODING UTILITIES</div>
          <h2>Base64 Encoder / Decoder</h2>
          <p>
            Encode text into Base64 or decode Base64 strings instantly.
            Supports Unicode and emojis.
          </p>
        </div>
      </div>

      <section className={styles.requestPanel}>
        <div className={styles.requestTop}>
          <div className={styles.requestLabel}>
            <Binary size={15} />
            BASE64 INPUT
          </div>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.sampleButton}
              onClick={loadSample}
            >
              <RotateCcw size={13} />
              Sample
            </button>

            <button
              type="button"
              className={styles.sampleButton}
              onClick={clearWorkspace}
            >
              <Trash2 size={13} />
              Clear
            </button>
          </div>
        </div>

        <div className={styles.modeBar}>
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={`${styles.modeTab} ${
                action === "encode" ? styles.modeTabActive : ""
              }`}
              onClick={() => handleActionChange("encode")}
            >
              Encode
            </button>

            <button
              type="button"
              className={`${styles.modeTab} ${
                action === "decode" ? styles.modeTabActive : ""
              }`}
              onClick={() => handleActionChange("decode")}
            >
              Decode
            </button>
          </div>

          <span className={styles.modeInfo}>
            {action === "encode"
              ? "TEXT → BASE64"
              : "BASE64 → TEXT"}
          </span>
        </div>

        <div className={styles.inputEditor}>
          <div className={styles.editorDescription}>
            {action === "encode"
              ? "Enter the text you want to convert into Base64."
              : "Paste your Base64 string to decode it into readable text."}
          </div>

          <Editor
            height="240px"
            language="plaintext"
            theme="vs-dark"
            value={input}
            onChange={(value) => handleInputChange(value ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              lineNumbersMinChars: 3,
              padding: { top: 14, bottom: 14 },
              renderLineHighlight: "none",
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                verticalScrollbarSize: 6,
                horizontalScrollbarSize: 6,
              },
            }}
          />
        </div>

        <div className={styles.requestFooter}>
          <span>{input.length} characters</span>
          <span>{inputBytes} bytes</span>
        </div>

        <div className={styles.processActions}>
          <span className={styles.processHint}>
            <AlertCircle size={13} />
            UTF-8 supported. Processed locally.
          </span>

          <button
            type="button"
            className={styles.processButton}
            onClick={handleProcess}
            disabled={!input.trim()}
          >
            <Zap size={14} />
            {action === "encode" ? "Encode Base64" : "Decode Base64"}
          </button>
        </div>
      </section>

      <section className={styles.responsePanel}>
        <div className={styles.responseHeader}>
          <div className={styles.responseTitle}>
            <Binary size={15} />
            BASE64 OUTPUT
          </div>

          {result && (
            <div className={styles.responseStats}>
              <span className={styles.statusSuccess}>
                <Check size={12} />
                Completed
              </span>
              <span>
                {result.action === "encode" ? "Encoded" : "Decoded"}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <>
            <div className={styles.outputEditor}>
              <Editor
                height="240px"
                language="plaintext"
                theme="vs-dark"
                value={output}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  lineNumbersMinChars: 3,
                  padding: { top: 14, bottom: 14 },
                  renderLineHighlight: "none",
                  overviewRulerLanes: 0,
                  hideCursorInOverviewRuler: true,
                  scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                  },
                }}
              />
            </div>

            <div className={styles.outputMetadata}>
              <span>Input: {result.inputBytes} bytes</span>
              <span>Output: {outputBytes} bytes</span>
              <span>{result.outputLength} characters</span>
            </div>

            <div className={styles.responseActionsBar}>
              <button
                type="button"
                onClick={swapContent}
                title="Use output as input and switch mode"
              >
                <ArrowLeftRight size={13} />
                Swap
              </button>

              <button
                type="button"
                onClick={() => void copyOutput()}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>

              <button type="button" onClick={downloadOutput}>
                <Download size={13} />
                Download
              </button>
            </div>

            <div className={styles.responseFooter}>
              <span>Processed locally in your browser</span>
              <span>UTF-8</span>
            </div>
          </>
        )}

        {!result && !error && (
          <div className={styles.emptyResponse}>
            <div className={styles.emptyIcon}>
              <Binary size={24} />
            </div>

            <strong>Your output will appear here.</strong>
            <span>
              Enter your input and choose Encode or Decode to get started.
            </span>
          </div>
        )}
      </section>

      <div className={styles.privacyNote}>
        <AlertCircle size={13} />
        <span>
          All processing happens locally in your browser. Base64 is an
          encoding format, not encryption, and does not protect sensitive data.
        </span>
      </div>
    </div>
  );
}
