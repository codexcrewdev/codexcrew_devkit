export type UrlMode = "component" | "full-url";
export type UrlAction = "encode" | "decode";

export interface UrlResult {
  output: string;
  inputLength: number;
  outputLength: number;
  action: UrlAction;
  mode: UrlMode;
}