import type {
  UrlAction,
  UrlMode,
  UrlResult,
} from "../types";

export function processUrl(
  input: string,
  action: UrlAction,
  mode: UrlMode
): UrlResult {
  if (!input.trim()) {
    throw new Error("Enter some text or URL to process.");
  }

  let output: string;

  try {
    if (action === "encode") {
      output =
        mode === "component"
          ? encodeURIComponent(input)
          : encodeURI(input);
    } else {
      output =
        mode === "component"
          ? decodeURIComponent(input)
          : decodeURI(input);
    }
  } catch {
    throw new Error(
      "Unable to decode this input. Check for invalid or incomplete percent-encoded characters."
    );
  }

  return {
    output,
    inputLength: input.length,
    outputLength: output.length,
    action,
    mode,
  };
}