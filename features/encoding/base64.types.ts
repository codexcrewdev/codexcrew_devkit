
export type Base64Action = "encode" | "decode";

export interface Base64Result {
  output: string;
  inputLength: number;
  outputLength: number;
  inputBytes: number;
  action: Base64Action;
}
