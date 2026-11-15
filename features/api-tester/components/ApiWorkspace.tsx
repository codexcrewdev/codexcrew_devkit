
"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Download,
  Globe,
  Play,
  RotateCcw,
  Square,
  Trash2,
} from "lucide-react";

import styles from "./ApiWorkspace.module.css";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>Loading editor...</div>
  ),
});

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ResponseData = {
  status: number;
  statusText: string;
  time: number;
  size: number;
  body: string;
  headers: Record<string, string>;
  url: string;
};

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const SAMPLE_HEADERS = {
  Accept: "application/json",
};

const SAMPLE_BODY = JSON.stringify(
  {
    title: "CodeXcrew DevKit",
    description: "Developer tools. Simplified.",
    active: true,
  },
  null,
  2
);

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function prettyPrint(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default function ApiWorkspace() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [headersText, setHeadersText] = useState(
    JSON.stringify(SAMPLE_HEADERS, null, 2)
  );
  const [paramsText, setParamsText] = useState("{}");
  const [body, setBody] = useState(SAMPLE_BODY);

  const [activeRequestTab, setActiveRequestTab] = useState<
    "params" | "headers" | "body"
  >("params");

  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeResponseTab, setActiveResponseTab] = useState<
    "body" | "headers"
  >("body");

  const controllerRef = useRef<AbortController | null>(null);

  function parseObject(
    value: string,
    label: string
  ): Record<string, unknown> {
    let parsed: unknown;

    try {
      parsed = JSON.parse(value);
    } catch {
      throw new Error(`${label} must contain valid JSON.`);
    }

    if (
      parsed === null ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      throw new Error(`${label} must be a JSON object.`);
    }

    return parsed as Record<string, unknown>;
  }

  function buildRequestUrl() {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      throw new Error("Enter an API URL first.");
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      throw new Error("Enter a valid absolute URL, including https://.");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Only HTTP and HTTPS URLs are supported.");
    }

    const params = parseObject(paramsText, "Query parameters");

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value) || typeof value === "object") {
        parsedUrl.searchParams.set(key, JSON.stringify(value));
      } else {
        parsedUrl.searchParams.set(key, String(value));
      }
    });

    return parsedUrl;
  }

  async function sendRequest() {
    setError("");
    setResponse(null);
    setCopied(false);

    let requestUrl: URL;
    let requestHeaders: Record<string, unknown>;

    try {
      requestUrl = buildRequestUrl();
      requestHeaders = parseObject(headersText, "Headers");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid request configuration."
      );
      return;
    }

    const headers = new Headers();

    try {
      Object.entries(requestHeaders).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (
          typeof value === "object" ||
          typeof value === "function"
        ) {
          throw new Error(`Header "${key}" must have a string value.`);
        }

        headers.set(key, String(value));
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid request headers."
      );
      return;
    }

    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      try {
        JSON.parse(body);
      } catch {
        setError("Request body is not valid JSON.");
        return;
      }
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);

    const startedAt = performance.now();

    try {
      const requestOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        requestOptions.body = body;
      }

      const result = await fetch(requestUrl.toString(), requestOptions);
      const responseText = await result.text();
      const elapsed = Math.round(performance.now() - startedAt);

      const responseHeaders: Record<string, string> = {};

      result.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const formattedBody = prettyPrint(responseText);
      const size = new TextEncoder().encode(responseText).length;

      setResponse({
        status: result.status,
        statusText: result.statusText,
        time: elapsed,
        size,
        body: formattedBody,
        headers: responseHeaders,
        url: result.url || requestUrl.toString(),
      });

      setActiveResponseTab("body");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Request cancelled.");
      } else {
        setError(
          "Unable to complete this request. The API may be unavailable, the URL may be incorrect, or the server may block browser requests through CORS."
        );
      }
    } finally {
      controllerRef.current = null;
      setLoading(false);
    }
  }

  function cancelRequest() {
    controllerRef.current?.abort();
  }

  async function copyResponse() {
    if (!response) return;

    try {
      await navigator.clipboard.writeText(response.body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Unable to copy response. Please copy it manually.");
    }
  }

  function downloadResponse() {
    if (!response) return;

    const blob = new Blob([response.body], {
      type: "application/json;charset=utf-8",
    });

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = "api-response.json";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(objectUrl);
  }

  function clearResponse() {
    setResponse(null);
    setError("");
    setCopied(false);
  }

  function loadSample() {
    setMethod("GET");
    setUrl("https://jsonplaceholder.typicode.com/posts/1");
    setHeadersText(JSON.stringify(SAMPLE_HEADERS, null, 2));
    setParamsText("{}");
    setBody(SAMPLE_BODY);
    setActiveRequestTab("params");
    clearResponse();
  }

  const statusClass =
    response && response.status >= 200 && response.status < 300
      ? styles.statusSuccess
      : styles.statusError;

  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <Globe size={22} />
        </div>

        <div>
          <div className={styles.eyebrow}>API DEVELOPMENT</div>
          <h2>API Tester</h2>
          <p>
            Send HTTP requests, inspect responses and debug your APIs.
          </p>
        </div>
      </div>

      <section className={styles.requestPanel}>
        <div className={styles.requestTop}>
          <div className={styles.requestLabel}>
            <Activity size={15} />
            REQUEST BUILDER
          </div>

          <button className={styles.sampleButton} onClick={loadSample}>
            <RotateCcw size={13} />
            Reset sample
          </button>
        </div>

        <div className={styles.urlBar}>
          <div className={styles.methodSelect}>
            <select
              value={method}
              onChange={(event) =>
                setMethod(event.target.value as HttpMethod)
              }
              aria-label="HTTP method"
            >
              {METHODS.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown size={13} />
          </div>

          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://api.example.com/endpoint"
            aria-label="Request URL"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !loading) {
                void sendRequest();
              }
            }}
          />

          {loading ? (
            <button
              className={styles.cancelButton}
              onClick={cancelRequest}
            >
              <Square size={13} />
              Cancel
            </button>
          ) : (
            <button
              className={styles.sendButton}
              onClick={() => void sendRequest()}
            >
              <Play size={14} fill="currentColor" />
              Send
            </button>
          )}
        </div>

        <div className={styles.requestTabs}>
          <button
            className={
              activeRequestTab === "params" ? styles.activeTab : ""
            }
            onClick={() => setActiveRequestTab("params")}
          >
            Query Params
          </button>

          <button
            className={
              activeRequestTab === "headers" ? styles.activeTab : ""
            }
            onClick={() => setActiveRequestTab("headers")}
          >
            Headers
          </button>

          <button
            className={
              activeRequestTab === "body" ? styles.activeTab : ""
            }
            onClick={() => setActiveRequestTab("body")}
          >
            Body
            <span className={styles.optionalTag}>JSON</span>
          </button>
        </div>

        <div className={styles.requestEditor}>
          {activeRequestTab === "params" && (
            <>
              <div className={styles.editorDescription}>
                Add query parameters as a JSON object. Values are added to
                the request URL.
              </div>

              <Editor
                height="175px"
                language="json"
                theme="vs-dark"
                value={paramsText}
                onChange={(value) => setParamsText(value ?? "")}
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
            </>
          )}

          {activeRequestTab === "headers" && (
            <>
              <div className={styles.editorDescription}>
                Set request headers as key-value pairs in a JSON object.
              </div>

              <Editor
                height="175px"
                language="json"
                theme="vs-dark"
                value={headersText}
                onChange={(value) => setHeadersText(value ?? "")}
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
            </>
          )}

          {activeRequestTab === "body" && (
            <>
              <div className={styles.editorDescription}>
                JSON request body. Used for POST, PUT and PATCH.
              </div>

              <Editor
                height="175px"
                language="json"
                theme="vs-dark"
                value={body}
                onChange={(value) => setBody(value ?? "")}
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
            </>
          )}
        </div>

        <div className={styles.requestFooter}>
          <span>Direct browser request</span>
          <span>JSON configuration</span>
        </div>
      </section>

      <section className={styles.responsePanel}>
        <div className={styles.responseHeader}>
          <div className={styles.responseTitle}>
            <Activity size={15} />
            RESPONSE
          </div>

          {response && (
            <div className={styles.responseStats}>
              <span className={statusClass}>
                {response.status} {response.statusText}
              </span>

              <span>
                <Clock3 size={12} />
                {response.time} ms
              </span>

              <span>{formatBytes(response.size)}</span>
            </div>
          )}
        </div>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className={styles.loadingBox}>
            <span className={styles.loader} />
            Sending request...
          </div>
        )}

        {!loading && response && (
          <>
            <div className={styles.responseTabs}>
              <button
                className={
                  activeResponseTab === "body" ? styles.activeTab : ""
                }
                onClick={() => setActiveResponseTab("body")}
              >
                Response Body
              </button>

              <button
                className={
                  activeResponseTab === "headers" ? styles.activeTab : ""
                }
                onClick={() => setActiveResponseTab("headers")}
              >
                Response Headers
              </button>

              <div className={styles.responseActions}>
                <button onClick={() => void copyResponse()}>
                  <Copy size={13} />
                  {copied ? "Copied" : "Copy"}
                </button>

                <button onClick={downloadResponse}>
                  <Download size={13} />
                  Download
                </button>
              </div>
            </div>

            {activeResponseTab === "body" ? (
              <div className={styles.responseEditor}>
                <Editor
                  height="350px"
                  language="json"
                  theme="vs-dark"
                  value={response.body}
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
            ) : (
              <div className={styles.headersResult}>
                {Object.entries(response.headers).length > 0 ? (
                  Object.entries(response.headers).map(([key, value]) => (
                    <div className={styles.headerRow} key={key}>
                      <strong>{key}</strong>
                      <span>{value}</span>
                    </div>
                  ))
                ) : (
                  <p>No response headers were exposed by the browser.</p>
                )}
              </div>
            )}

            <div className={styles.responseFooter}>
              <span>Response received</span>
              <span className={styles.responseUrl}>{response.url}</span>
            </div>
          </>
        )}

        {!loading && !response && !error && (
          <div className={styles.emptyResponse}>
            <div className={styles.emptyIcon}>
              <Activity size={24} />
            </div>
            <strong>No response yet</strong>
            <span>Configure your request and press Send.</span>
          </div>
        )}
      </section>

      <div className={styles.privacyNote}>
        <AlertCircle size={13} />
        Browser requests are subject to the target API&apos;s CORS policy.
        Avoid entering secrets into untrusted endpoints.
      </div>
    </div>
  );
}
