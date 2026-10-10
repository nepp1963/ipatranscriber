export type Accent = "us" | "uk";

export interface Syllable {
  /** IPA for this syllable, without stress marks. */
  ipa: string;
  /** 0 = unstressed, 1 = primary, 2 = secondary */
  stress: 0 | 1 | 2;
}

export interface Pronunciation {
  syllables: Syllable[];
}

/**
 * Any pronunciation backend must implement this interface.
 * Swap engines by changing `getEngine()` in ./index.ts.
 */
export interface PronunciationEngine {
  readonly name: string;
  load(): Promise<void>;
  isReady(): boolean;
  lookup(word: string, accent: Accent): Pronunciation | null;
}

export interface FormatOptions {
  showStress: boolean;
  showSyllables: boolean;
}
