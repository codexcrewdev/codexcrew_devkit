"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  AlertCircle,
  Check,
  Clock3,
  Clipboard,
  Copy,
  Download,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { decodeJwt } from "../utils/jwt.utils";
import type { JwtDecodeResult } from "../types";
import styles from "./JwtDecoder.module.css";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>Loading editor...</div>
  ),
});

type ResultTab = "header" | "payload" | "claims" | "signature";

const SAMPLE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<JwtDecodeResult | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>("header");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function decodeToken() {
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const decoded = decodeJwt(token);
      setResult(decoded);
      setActiveTab("header");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to decode this JWT."
      );
    }
  }

  function clearResponse() {
    setResult(null);
    setError("");
    setCopied(false);
  }

  function loadSample() {
    setToken(SAMPLE_TOKEN);
    setActiveTab("header");
    clearResponse();
  }

  function clearWorkspace() {
    setToken("");
    setActiveTab("header");
    clearResponse();
  }

  function getActiveContent() {
    if (!result) return "";

    switch (activeTab) {
      case "header":
        return result.header.formatted;
      case "payload":
        return result.payload.formatted;
      case "claims":
        return JSON.stringify(result.claims, null, 2);
      case "signature":
        return result.signature || "No signature section provided.";
      default:
        return "";
    }
  }

  async function copyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(getActiveContent());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Unable to copy output. Please copy it manually.");
    }
  }

  function downloadResult() {
    if (!result) return;

    const extension = activeTab === "signature" ? "txt" : "json";
    const blob = new Blob([getActiveContent()], {
      type: "text/plain;charset=utf-8",
    });

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = `jwt-${activeTab}.${extension}`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  const expiryClass = result
    ? result.expiry.expired
      ? styles.statusError
      : styles.statusSuccess
    : "";

  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <ShieldCheck size={22} />
        </div>

        <div>
          <div className={styles.eyebrow}>SECURITY UTILITIES</div>
          <h2>JWT Decoder</h2>
          <p>
            Decode JSON Web Tokens and inspect headers, payloads, claims and
            expiration details.
          </p>
        </div>
      </div>

      <section className={styles.requestPanel}>
        <div className={styles.requestTop}>
          <div className={styles.requestLabel}>
            <ShieldAlert size={15} />
            TOKEN INSPECTOR
          </div>

          <div className={styles.topActions}>
            <button className={styles.sampleButton} onClick={loadSample}>
              <RotateCcw size={13} />
              Sample
            </button>

            <button className={styles.sampleButton} onClick={clearWorkspace}>
              <Trash2 size={13} />
              Clear
            </button>
          </div>
        </div>

        <div className={styles.tokenEditor}>
          <div className={styles.editorDescription}>
            Paste your JWT below.
          </div>

          <Editor
            height="175px"
            language="plaintext"
            theme="vs-dark"
            value={token}
            onChange={(value) => {
              setToken(value ?? "");
              clearResponse();
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>

        <div className={styles.requestFooter}>
          <span>{token.length} characters</span>
          <span>
            {token.trim().split(".").length === 3 && token.trim()
              ? "3 JWT sections"
              : "Waiting for token"}
          </span>
        </div>

        <div className={styles.decodeActions}>
          <span className={styles.decodeHint}>
            <AlertCircle size={13} />
            Decoding does not verify the token signature.
          </span>

          <button
            className={styles.decodeButton}
            onClick={decodeToken}
            disabled={!token.trim()}
          >
            <ShieldCheck size={14} />
            Decode token
          </button>
        </div>
      </section>

      <section className={styles.responsePanel}>
        <div className={styles.responseHeader}>
          <div className={styles.responseTitle}>
            <Clipboard size={15} />
            DECODED OUTPUT
          </div>

          {result && (
            <div className={styles.responseStats}>
              <span className={styles.statusSuccess}>
                <Check size={12} />
                Decoded
              </span>

              <span>
                <Clock3 size={12} />
                {result.claims.length} claims
              </span>

              {result.expiry.exists && (
                <span className={expiryClass}>
                  {result.expiry.expired ? "Expired" : "Not expired"}
                </span>
              )}
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
            <div className={styles.responseTabs}>
              <button
                className={activeTab === "header" ? styles.activeTab : ""}
                onClick={() => {
                  setActiveTab("header");
                  setCopied(false);
                }}
              >
                Header
              </button>

              <button
                className={activeTab === "payload" ? styles.activeTab : ""}
                onClick={() => {
                  setActiveTab("payload");
                  setCopied(false);
                }}
              >
                Payload
              </button>

              <button
                className={activeTab === "claims" ? styles.activeTab : ""}
                onClick={() => {
                  setActiveTab("claims");
                  setCopied(false);
                }}
              >
                Claims
              </button>

              <button
                className={activeTab === "signature" ? styles.activeTab : ""}
                onClick={() => {
                  setActiveTab("signature");
                  setCopied(false);
                }}
              >
                Signature
              </button>

              <div className={styles.responseActions}>
                <button onClick={() => void copyResult()}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>

                <button onClick={downloadResult}>
                  <Download size={13} />
                  Download
                </button>
              </div>
            </div>

            {(activeTab === "header" || activeTab === "payload") && (
              <div className={styles.responseEditor}>
                <Editor
                  height="350px"
                  language="json"
                  theme="vs-dark"
                  value={
                    activeTab === "header"
                      ? result.header.formatted
                      : result.payload.formatted
                  }
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    padding: { top: 14, bottom: 14 },
                  }}
                />
              </div>
            )}

            {activeTab === "claims" && (
              <div className={styles.headersResult}>
                {result.claims.length > 0 ? (
                  result.claims.map((claim) => (
                    <div className={styles.headerRow} key={claim.name}>
                      <strong>{claim.name}</strong>
                      <div className={styles.claimDetails}>
                        <span>{claim.value}</span>
                        <small>{claim.description}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No registered JWT claims found in this payload.</p>
                )}
              </div>
            )}

            {activeTab === "signature" && (
              <div className={styles.signatureResult}>
                <div className={styles.signatureLabel}>
                  SIGNATURE SECTION
                </div>

                <code>
                  {result.signature || "No signature section provided."}
                </code>

                <p>
                  This is the encoded signature section. It has not been
                  cryptographically verified.
                </p>
              </div>
            )}

            <div className={styles.responseFooter}>
              <span>JWT decoded locally</span>
              <span>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} output
              </span>
            </div>
          </>
        )}

        {!result && !error && (
          <div className={styles.emptyResponse}>
            <div className={styles.emptyIcon}>
              <ShieldAlert size={24} />
            </div>
            <strong>Your decoded JWT details will appear here.</strong>
            <span>Paste a token and select Decode token.</span>
          </div>
        )}
      </section>

      <div className={styles.privacyNote}>
        <AlertCircle size={13} />
        Your token is processed locally in your browser. Avoid entering
        sensitive production tokens into untrusted tools.
      </div>
    </div>
  );
}