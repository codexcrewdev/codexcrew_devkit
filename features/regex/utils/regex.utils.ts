import type { RegexMatch, RegexTestResult } from "../types";

export function testRegex(
  pattern: string,
  flags: string,
  input: string
): RegexTestResult {
  if (!pattern) {
    throw new Error("Enter a regular expression pattern.");
  }

  if (!input) {
    throw new Error("Enter some text to test against your pattern.");
  }

  let regex: RegExp;

  try {
    regex = new RegExp(pattern, flags);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Invalid regular expression."
    );
  }

  const startTime = performance.now();
  const matches: RegexMatch[] = [];
  const shouldFindAll = flags.includes("g") || flags.includes("y");

  if (shouldFindAll) {
    let match: RegExpExecArray | null;
    let safetyCounter = 0;

    while ((match = regex.exec(input)) !== null) {
      matches.push({
        index: match.index,
        match: match[0],
        groups: match.slice(1),
      });

      if (match[0] === "") {
        regex.lastIndex++;
      }

      safetyCounter++;

      if (safetyCounter > 10000) {
        throw new Error(
          "Too many matches. Try a more specific regular expression."
        );
      }
    }
  } else {
    const match = regex.exec(input);

    if (match) {
      matches.push({
        index: match.index,
        match: match[0],
        groups: match.slice(1),
      });
    }
  }

  return {
    matches,
    totalMatches: matches.length,
    executionTime: performance.now() - startTime,
  };
}