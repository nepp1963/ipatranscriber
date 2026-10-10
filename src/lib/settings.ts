export interface Settings {
  showStress: boolean;
  showSyllables: boolean;
  preservePunctuation: boolean;
  highlightUnknown: boolean;
  autoCopy: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  showStress: true,
  showSyllables: false,
  preservePunctuation: true,
  highlightUnknown: true,
  autoCopy: false,
};

export const SETTING_LABELS: Record<keyof Settings, { label: string; hint: string }> = {
  showStress: { label: "Show stress marks", hint: "ˈ primary, ˌ secondary" },
  showSyllables: { label: "Show syllable breaks", hint: "Dots between syllables" },
  preservePunctuation: { label: "Preserve punctuation", hint: "Keep commas, periods, etc." },
  highlightUnknown: { label: "Highlight unknown words", hint: "Mark words not in the dictionary" },
  autoCopy: { label: "Auto-copy output", hint: "Copy IPA when you stop typing" },
};

export interface HistoryItem {
  id: string;
  text: string;
  accent: "us" | "uk";
  at: number;
}

export const HISTORY_LIMIT = 20;

export function addToHistory(list: HistoryItem[], item: HistoryItem): HistoryItem[] {
  const rest = list.filter((h) => h.text !== item.text);
  return [item, ...rest].slice(0, HISTORY_LIMIT);
}
