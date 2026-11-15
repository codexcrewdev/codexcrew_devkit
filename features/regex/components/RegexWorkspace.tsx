
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  Fingerprint,
  RotateCcw,
  Search,
  Trash2,
  Zap,
} from "lucide-react";

import { testRegex } from "../utils/regex.utils";
import type { RegexTestResult } from "../types";
import styles from "./RegexWorkspace.module.css";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>Loading editor...</div>
  ),
});

const SAMPLE_TEXT = `Hello CodeXcrew!
Contact: hello@codexcrew.in
Website: https://codexcrew.in
Phone: +91 9876543210
Order ID: CX-2026-001`;

const FLAGS = [
  { value: "g", label: "Global", description: "Find all matches" },
  { value: "i", label: "Ignore case", description: "Case-insensitive" },
  { value: "m", label: "Multiline", description: "^ and $ per line" },
  { value: "s", label: "Dot all", description: "Dot matches newlines" },
  { value: "u", label: "Unicode", description: "Unicode-aware matching" },
  { value: "y", label: "Sticky", description: "Match at lastIndex" },
] as const;

const EXAMPLES = [
  {
    name: "Email",
    pattern: "[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}",
    flags: "gi",
  },
  {
    name: "URL",
    pattern: "https?:\\/\\/[^\\s]+",
    flags: "gi",
  },
  {
    name: "Phone",
    pattern: "\\+?\\d[\\d\\s-]{8,}\\d",
    flags: "g",
  },
  {
    name: "Numbers",
    pattern: "\\d+",
    flags: "g",
  },
  {
    name: "Words",
    pattern: "\\b\\w+\\b",
    flags: "gi",
  },
];

interface HighlightPart {
  text: string;
  matched: boolean;
  index: number;
}

export default function RegexWorkspace() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string[]>(["g"]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<RegexTestResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const flagString = flags.join("");

  function resetResult() {
    setResult(null);
    setError("");
    setCopied(false);
  }

  function handlePatternChange(value: string) {
    setPattern(value);
    resetResult();
  }

  function handleInputChange(value: string) {
    setInput(value);
    resetResult();
  }

  function toggleFlag(flag: string) {
    setFlags((current) =>
      current.includes(flag)
        ? current.filter((item) => item !== flag)
        : [...current, flag]
    );
    resetResult();
  }

  function loadExample(example: (typeof EXAMPLES)[number]) {
    setPattern(example.pattern);
    setFlags(example.flags.split(""));
    setInput(SAMPLE_TEXT);
    resetResult();
  }

  function loadSample() {
    setInput(SAMPLE_TEXT);
    resetResult();
  }

  function clearWorkspace() {
    setPattern("");
    setFlags(["g"]);
    setInput("");
    resetResult();
  }

  function handleTest() {
    resetResult();

    try {
      const testResult = testRegex(pattern, flagString, input);
      setResult(testResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to test this expression."
      );
    }
  }

  const highlightedParts = useMemo<HighlightPart[]>(() => {
    if (!result || result.matches.length === 0) return [];

    const parts: HighlightPart[] = [];
    let cursor = 0;

    result.matches.forEach((match, index) => {
      const start = match.index;
      const end = start + match.match.length;

      if (start > cursor) {
        parts.push({
          text: input.slice(cursor, start),
          matched: false,
          index,
        });
      }

      if (end > start) {
        parts.push({
          text: input.slice(start, end),
          matched: true,
          index,
        });
      }

      cursor = Math.max(cursor, end);
    });

    if (cursor < input.length) {
      parts.push({
        text: input.slice(cursor),
        matched: false,
        index: -1,
      });
    }

    return parts;
  }, [result, input]);

  async function copyMatches() {
    if (!result || result.matches.length === 0) return;

    try {
      const content = result.matches
        .map((match) => match.match)
        .join("\n");

      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Unable to copy matches. Please copy them manually.");
    }
  }

  const characterCount = input.length;
  const byteCount = new TextEncoder().encode(input).length;

  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <div className={styles.introIcon}>
          <Search size={22} />
        </div>

        <div className={styles.introContent}>
          <div className={styles.eyebrow}>DEVELOPER UTILITIES</div>
          <h2>Regex Tester</h2>
          <p>
            Test regular expressions, highlight matches and inspect capture
            groups instantly in your browser.
          </p>
        </div>
      </div>

      <section className={styles.requestPanel}>
        <div className={styles.requestTop}>
          <div className={styles.requestLabel}>
            <Fingerprint size={15} />
            REGULAR EXPRESSION
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

        <div className={styles.patternArea}>
          <div className={styles.patternLabel}>
            <label htmlFor="regex-pattern">PATTERN</label>
            <span>JavaScript RegExp</span>
          </div>

          <div className={styles.patternInput}>
            <span className={styles.patternSlash}>/</span>

            <input
              id="regex-pattern"
              type="text"
              value={pattern}
              onChange={(event) => handlePatternChange(event.target.value)}
              placeholder="Enter your regular expression..."
              spellCheck={false}
              autoComplete="off"
            />

            <span className={styles.patternSlash}>/{flagString}</span>
          </div>

          <div className={styles.examples}>
            <span className={styles.examplesLabel}>EXAMPLES</span>

            {EXAMPLES.map((example) => (
              <button
                type="button"
                key={example.name}
                className={styles.exampleButton}
                onClick={() => loadExample(example)}
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.flagsArea}>
          <div className={styles.flagsHeading}>
            <span>REGEX FLAGS</span>
            <span>{flags.length} selected</span>
          </div>

          <div className={styles.flagsGrid}>
            {FLAGS.map((flag) => {
              const selected = flags.includes(flag.value);

              return (
                <label
                  key={flag.value}
                  className={`${styles.flagOption} ${
                    selected ? styles.flagActive : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleFlag(flag.value)}
                  />

                  <span className={styles.flagCode}>{flag.value}</span>

                  <span className={styles.flagInfo}>
                    <strong>{flag.label}</strong>
                    <small>{flag.description}</small>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className={styles.testEditor}>
          <div className={styles.editorDescription}>
            Enter the text you want to test your expression against.
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
          <span>{characterCount} characters</span>
          <span>{byteCount} bytes</span>
        </div>

        <div className={styles.testActions}>
          <span className={styles.testHint}>
            <AlertCircle size={13} />
            Complex patterns may take longer to execute.
          </span>

          <button
            type="button"
            className={styles.testButton}
            onClick={handleTest}
            disabled={!pattern || !input}
          >
            <Zap size={14} />
            Test expression
          </button>
        </div>
      </section>

      <section className={styles.responsePanel}>
        <div className={styles.responseHeader}>
          <div className={styles.responseTitle}>
            <Search size={15} />
            MATCH RESULTS
          </div>

          {result && (
            <div className={styles.responseStats}>
              <span className={styles.statusSuccess}>
                <Check size={12} />
                Tested
              </span>
              <span>{result.totalMatches} matches</span>
              <span>{result.executionTime.toFixed(2)} ms</span>
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
            <div className={styles.resultSummary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>TOTAL MATCHES</span>
                <strong>{result.totalMatches}</strong>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>EXECUTION TIME</span>
                <strong>{result.executionTime.toFixed(2)} ms</strong>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>FLAGS</span>
                <strong>{flagString || "None"}</strong>
              </div>
            </div>

            <div className={styles.resultSection}>
              <div className={styles.resultSectionHeader}>
                <div className={styles.resultsHeading}>
                  MATCH HIGHLIGHTING
                </div>

                <span className={styles.matchLegend}>
                  <span />
                  Matched text
                </span>
              </div>

              <div className={styles.highlightedText}>
                {result.matches.length > 0 ? (
                  highlightedParts.map((part, index) => (
                    <span
                      key={`${part.index}-${index}`}
                      className={
                        part.matched ? styles.highlight : styles.noHighlight
                      }
                    >
                      {part.text}
                    </span>
                  ))
                ) : (
                  <span className={styles.noMatches}>
                    No matches found for this expression.
                  </span>
                )}
              </div>
            </div>

            {result.matches.length > 0 && (
              <div className={styles.matchesSection}>
                <div className={styles.resultsHeader}>
                  <div className={styles.resultsHeading}>
                    MATCH DETAILS ({result.totalMatches})
                  </div>

                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={() => void copyMatches()}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy matches"}
                  </button>
                </div>

                <div className={styles.matchList}>
                  {result.matches.map((match, index) => (
                    <div className={styles.matchCard} key={`${match.index}-${index}`}>
                      <div className={styles.matchCardHeader}>
                        <span>Match {index + 1}</span>
                        <span>Index: {match.index}</span>
                      </div>

                      <code>{match.match || "(empty match)"}</code>

                      {match.groups.length > 0 && (
                        <div className={styles.captureGroups}>
                          <span>CAPTURE GROUPS</span>

                          {match.groups.map((group, groupIndex) => (
                            <div
                              key={groupIndex}
                              className={styles.captureGroup}
                            >
                              <span>Group {groupIndex + 1}</span>
                              <code>{group ?? "undefined"}</code>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.responseFooter}>
              <span>Tested locally in your browser</span>
              <span>{result.totalMatches} total matches</span>
            </div>
          </>
        )}

        {!result && !error && (
          <div className={styles.emptyResponse}>
            <div className={styles.emptyIcon}>
              <Search size={24} />
            </div>

            <strong>Your regex results will appear here.</strong>
            <span>Enter a pattern and test it against your sample text.</span>
          </div>
        )}
      </section>

      <div className={styles.privacyNote}>
        <AlertCircle size={13} />
        <span>
          Your text is processed locally in your browser using JavaScript
          regular expressions. Avoid testing untrusted, complex patterns that
          may cause excessive execution time.
        </span>
      </div>
    </div>
  );
}
