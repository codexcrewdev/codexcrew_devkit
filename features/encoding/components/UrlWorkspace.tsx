
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  Clipboard,
  Code2,
  Download,
  Globe,
  Link,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";

import { processUrl } from "../utils/url.utils";
import type { UrlAction, UrlMode } from "../types";
import styles from "./UrlWorkspace.module.css";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>Loading code editor...</div>
  ),
});

type ResultStatus = "success" | "error" | "idle";

const SAMPLE_URL =
  "https://codexcrew.in/search?q=developer tools&category=web development";

export default function UrlWorkspace() {
  const [input, setInput] = useState(SAMPLE_URL);
  const [output, setOutput] = useState("");
  const [action, setAction] = useState<UrlAction>("encode");
  const [mode, setMode] = useState<UrlMode>("component");
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [message, setMessage] = useState(
    "Enter a URL or text to get started."
  );
  const [copied, setCopied] = useState(false);

  const inputStats = useMemo(() => {
    return {
      characters: input.length,
      lines: input ? input.split("\n").length : 0,
      bytes: new TextEncoder().encode(input).length,
    };
  }, [input]);

  const outputStats = useMemo(() => {
    return {
      characters: output.length,
      lines: output ? output.split("\n").length : 0,
      bytes: new TextEncoder().encode(output).length,
    };
  }, [output]);

  function resetResult() {
    setOutput("");
    setStatus("idle");
    setMessage("Ready to process your URL.");
    setCopied(false);
  }

  function handleInputChange(value: string | undefined) {
    setInput(value ?? "");
    resetResult();
  }

  function processInput(
    selectedAction: UrlAction = action,
    selectedMode: UrlMode = mode
  ) {
    setCopied(false);

    if (!input.trim()) {
      setOutput("");
      setStatus("error");
      setMessage("Please enter some text or URL before processing.");
      return;
    }

    try {
      const result = processUrl(input, selectedAction, selectedMode);

      setOutput(result.output);
      setStatus("success");
      setMessage(
        selectedAction === "encode"
          ? "URL successfully encoded."
          : "URL successfully decoded."
      );
    } catch (error) {
      setOutput("");
      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to process this input."
      );
    }
  }

  function handleActionChange(nextAction: UrlAction) {
    setAction(nextAction);
    resetResult();
  }

  function handleModeChange(nextMode: UrlMode) {
    setMode(nextMode);
    resetResult();
  }

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setStatus("error");
      setMessage("Unable to access clipboard. Please copy manually.");
    }
  }

  function downloadOutput() {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      action === "encode" ? "encoded-url.txt" : "decoded-url.txt";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clearWorkspace() {
    setInput("");
    setOutput("");
    setStatus("idle");
    setMessage("Workspace cleared. Enter a URL to get started.");
    setCopied(false);
  }

  function loadSample() {
    setInput(SAMPLE_URL);
    setOutput("");
    setAction("encode");
    setMode("component");
    setStatus("idle");
    setMessage("Sample URL loaded. Choose an operation.");
    setCopied(false);
  }

  function swapInputOutput() {
    if (!output) return;

    setInput(output);
    setOutput("");
    setAction((current) =>
      current === "encode" ? "decode" : "encode"
    );
    setStatus("idle");
    setMessage("Output moved to input. Ready for the next operation.");
    setCopied(false);
  }

  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <Link size={22} />
        </div>

        <div>
          <div className={styles.introEyebrow}>URL UTILITIES</div>
          <h2>URL Encoder / Decoder</h2>
          <p>
            Encode and decode URLs or individual URL components with a
            developer-friendly workspace.
          </p>
        </div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.modeTabs}>
          <button
            type="button"
            className={`${styles.modeButton} ${
              action === "encode" ? styles.activeMode : ""
            }`}
            onClick={() => handleActionChange("encode")}
          >
            <Sparkles size={15} />
            Encode
          </button>

          <button
            type="button"
            className={`${styles.modeButton} ${
              action === "decode" ? styles.activeMode : ""
            }`}
            onClick={() => handleActionChange("decode")}
          >
            <Code2 size={15} />
            Decode
          </button>
        </div>

        <div className={styles.secondaryActions}>
          <label className={styles.modeLabel} htmlFor="url-mode">
            MODE
          </label>

          <select
            id="url-mode"
            className={styles.modeSelect}
            value={mode}
            onChange={(event) =>
              handleModeChange(event.target.value as UrlMode)
            }
          >
            <option value="component">Component</option>
            <option value="full-url">Full URL</option>
          </select>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={loadSample}
            title="Load sample URL"
          >
            <Upload size={14} />
            <span>Sample</span>
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={clearWorkspace}
            title="Clear workspace"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className={styles.editorGrid}>
        <section className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Globe size={15} />
              <span>INPUT.URL</span>
            </div>

            <span className={styles.panelMeta}>EDITABLE</span>
          </div>

          <div className={styles.editorContainer}>
            <Editor
              height="430px"
              language="plaintext"
              theme="vs-dark"
              value={input}
              onChange={handleInputChange}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineHeight: 22,
                fontFamily: "var(--font-mono)",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 15, bottom: 15 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                overviewRulerBorder: false,
                scrollbar: {
                  verticalScrollbarSize: 7,
                  horizontalScrollbarSize: 7,
                },
              }}
            />
          </div>

          <div className={styles.editorFooter}>
            <span>{inputStats.lines} lines</span>
            <span>{inputStats.characters} characters</span>
            <span>{inputStats.bytes} bytes</span>
          </div>
        </section>

        <section className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Link size={15} />
              <span>OUTPUT.URL</span>
            </div>

            <div className={styles.outputActions}>
              <button
                type="button"
                onClick={swapInputOutput}
                disabled={!output}
                title="Move output to input and reverse operation"
              >
                <ArrowLeftRight size={13} />
                <span>Swap</span>
              </button>

              <button
                type="button"
                onClick={() => void copyOutput()}
                disabled={!output}
                title="Copy output"
              >
                {copied ? <Check size={13} /> : <Clipboard size={13} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <button
                type="button"
                onClick={downloadOutput}
                disabled={!output}
                title="Download output"
              >
                <Download size={13} />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className={styles.editorContainer}>
            <Editor
              height="430px"
              language="plaintext"
              theme="vs-dark"
              value={output}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineHeight: 22,
                fontFamily: "var(--font-mono)",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 15, bottom: 15 },
                lineNumbers: "on",
                renderLineHighlight: "none",
                overviewRulerBorder: false,
                scrollbar: {
                  verticalScrollbarSize: 7,
                  horizontalScrollbarSize: 7,
                },
              }}
            />

            {!output && (
              <div className={styles.outputPlaceholder}>
                <Link size={28} />
                <span>Your processed URL will appear here.</span>
                <small>Choose Encode or Decode and run the tool.</small>
              </div>
            )}
          </div>

          <div className={styles.editorFooter}>
            <span>{outputStats.lines} lines</span>
            <span>{outputStats.characters} characters</span>
            <span>{outputStats.bytes} bytes</span>
          </div>
        </section>
      </div>

      <div className={styles.processBar}>
        <div className={styles.statusMessage}>
          {status === "success" && (
            <Check size={16} className={styles.successIcon} />
          )}

          {status === "error" && (
            <XCircle size={16} className={styles.errorIcon} />
          )}

          {status === "idle" && <span className={styles.idleDot} />}

          <span
            className={
              status === "success"
                ? styles.successText
                : status === "error"
                  ? styles.errorText
                  : ""
            }
          >
            {message}
          </span>
        </div>

        <button
          type="button"
          className={styles.runButton}
          onClick={() => processInput()}
        >
          {action === "encode" ? (
            <Sparkles size={15} />
          ) : (
            <Code2 size={15} />
          )}
          Run {action === "encode" ? "Encoder" : "Decoder"}
        </button>
      </div>

      <div className={styles.privacyNote}>
        <Check size={13} />
        Your input is processed locally in your browser. Nothing is uploaded.
      </div>
    </div>
  );
}
