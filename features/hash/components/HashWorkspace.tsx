
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  Fingerprint,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";

import { generateHash, getByteLength } from "../utils/hash.utils";
import type { HashAlgorithm, HashResult } from "../types";
import styles from "./HashWorkspace.module.css";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>Loading editor...</div>
  ),
});

const SAMPLE_TEXT = "CodeXcrew DevKit - Developer tools. Simplified.";

const ALGORITHMS: HashAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

export default function HashWorkspace() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [result, setResult] = useState<HashResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setError("");
    setResult(null);
    setCopied(false);

    if (!input.trim()) {
      setError("Enter some text before generating a hash.");
      return;
    }

    setLoading(true);

    try {
      const hash = await generateHash(input, algorithm);

      setResult({
        algorithm,
        hash,
        inputBytes: getByteLength(input),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to generate the hash."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(value: string) {
    setInput(value);
    setResult(null);
    setError("");
    setCopied(false);
  }

  function loadSample() {
    handleInputChange(SAMPLE_TEXT);
  }

  function clearWorkspace() {
    handleInputChange("");
  }

  async function copyHash() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.hash);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Unable to copy the hash. Please copy it manually.");
    }
  }

  function downloadHash() {
    if (!result) return;

    const content = [
      `Algorithm: ${result.algorithm}`,
      `Input bytes: ${result.inputBytes}`,
      "",
      result.hash,
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = `codexcrew-${algorithm.toLowerCase()}.txt`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  const byteCount = getByteLength(input);

  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <Fingerprint size={22} />
        </div>

        <div className={styles.introContent}>
          <div className={styles.eyebrow}>SECURITY UTILITIES</div>
          <h2>Hash Generator</h2>
          <p>
            Generate SHA-256, SHA-384 and SHA-512 hashes from your text
            instantly in your browser.
          </p>
        </div>
      </div>

      <section className={styles.requestPanel}>
        <div className={styles.requestTop}>
          <div className={styles.requestLabel}>
            <Fingerprint size={15} />
            HASH INPUT
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

        <div className={styles.algorithmBar}>
          <label htmlFor="hash-algorithm">ALGORITHM</label>

          <div className={styles.algorithmSelect}>
            <select
              id="hash-algorithm"
              value={algorithm}
              onChange={(event) => {
                setAlgorithm(event.target.value as HashAlgorithm);
                setResult(null);
                setError("");
                setCopied(false);
              }}
            >
              {ALGORITHMS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <span className={styles.algorithmInfo}>
            <ShieldCheck size={13} />
            Secure hash algorithm
          </span>
        </div>

        <div className={styles.inputEditor}>
          <div className={styles.editorDescription}>
            Enter the text you want to hash. Your input stays in your browser.
          </div>

          <Editor
            height="210px"
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
          <span>{byteCount} bytes</span>
        </div>

        <div className={styles.generateActions}>
          <span className={styles.generateHint}>
            <AlertCircle size={13} />
            Hashing is one-way and cannot be reversed.
          </span>

          <button
            type="button"
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={!input.trim() || loading}
          >
            <Zap size={14} />
            {loading ? "Generating..." : "Generate hash"}
          </button>
        </div>
      </section>

      <section className={styles.responsePanel}>
        <div className={styles.responseHeader}>
          <div className={styles.responseTitle}>
            <ShieldCheck size={15} />
            GENERATED HASH
          </div>

          {result && (
            <div className={styles.responseStats}>
              <span className={styles.statusSuccess}>
                <Check size={12} />
                Generated
              </span>
              <span>{result.algorithm}</span>
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
            <div className={styles.hashResult}>
              <div className={styles.hashLabel}>HASH OUTPUT</div>

              <code>{result.hash}</code>

              <div className={styles.hashMetadata}>
                <span>Algorithm: {result.algorithm}</span>
                <span>Input size: {result.inputBytes} bytes</span>
                <span>Output: {result.hash.length * 4}-bit</span>
              </div>
            </div>

            <div className={styles.responseActionsBar}>
              <button
                type="button"
                onClick={() => void copyHash()}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy hash"}
              </button>

              <button type="button" onClick={downloadHash}>
                <Download size={13} />
                Download
              </button>
            </div>

            <div className={styles.responseFooter}>
              <span>Hash generated locally</span>
              <span>{result.algorithm}</span>
            </div>
          </>
        )}

        {!result && !error && (
          <div className={styles.emptyResponse}>
            <div className={styles.emptyIcon}>
              <Fingerprint size={24} />
            </div>

            <strong>Your generated hash will appear here.</strong>
            <span>Enter text, select an algorithm and generate a hash.</span>
          </div>
        )}
      </section>

      <div className={styles.privacyNote}>
        <AlertCircle size={13} />
        <span>
          Text is processed locally using the browser&apos;s Web Crypto API.
          SHA-256, SHA-384 and SHA-512 are supported.
        </span>
      </div>
    </div>
  );
}
