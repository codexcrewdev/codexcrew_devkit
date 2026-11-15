
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  Braces,
  Check,
  Clipboard,
  Download,
  FileJson,
  Minimize2,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";

import styles from "./JsonWorkspace.module.css";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>Loading code editor...</div>
  ),
});

type JsonMode = "format" | "validate" | "minify";
type ResultStatus = "success" | "error" | "idle";

const SAMPLE_JSON = `{
  "project": "CodeXcrew DevKit",
  "version": "1.0.0",
  "free": true,
  "features": [
    "JSON Formatter",
    "JSON Validator",
    "JSON Minifier"
  ],
  "developer": {
    "name": "Developer",
    "tools": 10
  }
}`;

export default function JsonWorkspace() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<JsonMode>("format");
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [message, setMessage] = useState(
    "Enter JSON or load the sample to get started."
  );
  const [copied, setCopied] = useState(false);

  const inputStats = useMemo(() => {
    const bytes = new TextEncoder().encode(input).length;

    return {
      characters: input.length,
      lines: input ? input.split("\n").length : 0,
      bytes,
    };
  }, [input]);

  const outputStats = useMemo(() => {
    return {
      characters: output.length,
      bytes: new TextEncoder().encode(output).length,
    };
  }, [output]);

  function resetResult() {
    setOutput("");
    setStatus("idle");
    setMessage("Ready to process JSON.");
    setCopied(false);
  }

  function handleInputChange(value: string | undefined) {
    setInput(value ?? "");
    resetResult();
  }

  function processJson(selectedMode: JsonMode = mode) {
    setMode(selectedMode);
    setCopied(false);

    if (!input.trim()) {
      setOutput("");
      setStatus("error");
      setMessage("Please enter some JSON before processing.");
      return;
    }

    try {
      const parsed = JSON.parse(input);

      if (selectedMode === "minify") {
        const result = JSON.stringify(parsed);
        setOutput(result);
        setStatus("success");
        setMessage("JSON successfully minified.");
        return;
      }

      const result = JSON.stringify(parsed, null, 2);
      setOutput(result);
      setStatus("success");

      if (selectedMode === "validate") {
        setMessage("Valid JSON. No syntax errors found.");
      } else {
        setMessage("JSON successfully formatted.");
      }
    } catch (error) {
      setOutput("");

      const errorMessage =
        error instanceof Error ? error.message : "Invalid JSON syntax.";

      setStatus("error");
      setMessage(errorMessage);
    }
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
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      mode === "minify" ? "minified.json" : "formatted.json";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  function clearWorkspace() {
    setInput("");
    setOutput("");
    setStatus("idle");
    setMessage("Workspace cleared. Enter JSON to get started.");
    setCopied(false);
  }

  function loadSample() {
    setInput(SAMPLE_JSON);
    setOutput("");
    setStatus("idle");
    setMessage("Sample JSON loaded. Choose an operation.");
    setCopied(false);
  }

  function handleModeChange(nextMode: JsonMode) {
    setMode(nextMode);
    processJson(nextMode);
  }

  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <Braces size={22} />
        </div>

        <div>
          <div className={styles.introEyebrow}>JSON UTILITIES</div>
          <h2>JSON Toolkit</h2>
          <p>
            Format, validate and minify JSON data with a developer-friendly
            workspace.
          </p>
        </div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.modeTabs}>
          <button
            className={`${styles.modeButton} ${
              mode === "format" ? styles.activeMode : ""
            }`}
            onClick={() => handleModeChange("format")}
          >
            <Sparkles size={15} />
            Format
          </button>

          <button
            className={`${styles.modeButton} ${
              mode === "validate" ? styles.activeMode : ""
            }`}
            onClick={() => handleModeChange("validate")}
          >
            <Check size={15} />
            Validate
          </button>

          <button
            className={`${styles.modeButton} ${
              mode === "minify" ? styles.activeMode : ""
            }`}
            onClick={() => handleModeChange("minify")}
          >
            <Minimize2 size={15} />
            Minify
          </button>
        </div>

        <div className={styles.secondaryActions}>
          <button
            className={styles.secondaryButton}
            onClick={loadSample}
            title="Load sample JSON"
          >
            <Upload size={14} />
            <span>Sample</span>
          </button>

          <button
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
              <FileJson size={15} />
              <span>INPUT.JSON</span>
            </div>

            <span className={styles.panelMeta}>EDITABLE</span>
          </div>

          <div className={styles.editorContainer}>
            <Editor
              height="430px"
              language="json"
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
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true,
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
              <Braces size={15} />
              <span>OUTPUT.JSON</span>
            </div>

            <div className={styles.outputActions}>
              <button
                onClick={copyOutput}
                disabled={!output}
                title="Copy output"
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <button
                onClick={downloadOutput}
                disabled={!output}
                title="Download output"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className={styles.editorContainer}>
            <Editor
              height="430px"
              language="json"
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
                <Braces size={28} />
                <span>Your JSON output will appear here.</span>
                <small>Choose Format, Validate or Minify.</small>
              </div>
            )}
          </div>

          <div className={styles.editorFooter}>
            <span>{output ? output.split("\n").length : 0} lines</span>
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

          {status === "idle" && (
            <span className={styles.idleDot} />
          )}

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
          className={styles.runButton}
          onClick={() => processJson()}
        >
          <Braces size={15} />
          Run {mode === "format" ? "Formatter" : mode === "validate" ? "Validation" : "Minifier"}
        </button>
      </div>

      <div className={styles.privacyNote}>
        <Check size={13} />
        Your JSON is processed locally in your browser. Nothing is uploaded.
      </div>
    </div>
  );
}
