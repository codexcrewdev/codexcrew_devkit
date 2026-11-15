export interface RegexMatch {
  index: number;
  match: string;
  groups: string[];
}

export interface RegexTestResult {
  matches: RegexMatch[];
  totalMatches: number;
  executionTime: number;
}