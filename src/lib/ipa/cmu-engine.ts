import { arpabetToPronunciation } from "./arpabet";
import type { Accent, Pronunciation, PronunciationEngine } from "./types";

type Dict = Record<string, string>;

const VOICELESS = new Set(["P", "T", "K", "F", "TH"]);
const SIBILANT = new Set(["S", "Z", "SH", "ZH", "CH", "JH"]);

function lastPhone(arpa: string) {
  const parts = arpa.trim().split(/\s+/);
  return parts[parts.length - 1]!.replace(/\d/g, "");
}

/** Pronunciation engine backed by the CMU Pronouncing Dictionary (~134k words). */
export class CmuEngine implements PronunciationEngine {
  readonly name = "CMU Pronouncing Dictionary";
  private dict: Dict | null = null;
  private loading: Promise<void> | null = null;
  private cache = new Map<string, Pronunciation | null>();

  constructor(dict?: Dict) {
    if (dict) this.dict = dict;
  }

  isReady() {
    return this.dict !== null;
  }

  load() {
    if (this.dict) return Promise.resolve();
    if (!this.loading) {
      this.loading = import("cmu-pronouncing-dictionary").then((m) => {
        this.dict = m.dictionary as Dict;
      });
    }
    return this.loading;
  }

  /** Returns ARPAbet for a word, with simple morphological fallbacks. */
  arpabet(word: string): string | null {
    const d = this.dict;
    if (!d) return null;
    const w = word.toLowerCase().replace(/’/g, "'");
    if (d[w]) return d[w];

    const tryBase = (bases: string[]) => {
      for (const b of bases) if (b.length > 1 && d[b]) return d[b];
      return null;
    };

    if (w.endsWith("'s") || (w.endsWith("s") && !w.endsWith("ss"))) {
      const stem = w.endsWith("'s") ? w.slice(0, -2) : w.slice(0, -1);
      const extra = w.endsWith("ies")
        ? [w.slice(0, -3) + "y"]
        : w.endsWith("es")
          ? [w.slice(0, -2)]
          : [];
      const base = tryBase([stem, ...extra]);
      if (base) {
        const last = lastPhone(base);
        const suf = SIBILANT.has(last) ? "IH0 Z" : VOICELESS.has(last) ? "S" : "Z";
        return `${base} ${suf}`;
      }
    }
    if (w.endsWith("ed")) {
      const s = w.slice(0, -2);
      const base = tryBase([
        s,
        s + "e",
        s.slice(0, -1),
        s.endsWith("i") ? s.slice(0, -1) + "y" : "",
      ]);
      if (base) {
        const last = lastPhone(base);
        const suf =
          last === "T" || last === "D"
            ? "IH0 D"
            : VOICELESS.has(last) || ["S", "SH", "CH"].includes(last)
              ? "T"
              : "D";
        return `${base} ${suf}`;
      }
    }
    if (w.endsWith("ing")) {
      const s = w.slice(0, -3);
      const base = tryBase([s, s + "e", s.slice(0, -1)]);
      if (base) return `${base} IH0 NG`;
    }
    if (w.endsWith("ly")) {
      const base = tryBase([w.slice(0, -2), w.slice(0, -1) + "e"]);
      if (base) return `${base} L IY0`;
    }
    if (w.endsWith("ness")) {
      const base = tryBase([w.slice(0, -4), w.slice(0, -5) + "y"]);
      if (base) return `${base} N AH0 S`;
    }
    if (w.endsWith("er")) {
      const s = w.slice(0, -2);
      const base = tryBase([s, s + "e", s.slice(0, -1)]);
      if (base) return `${base} ER0`;
    }
    return null;
  }

  lookup(word: string, accent: Accent): Pronunciation | null {
    const key = `${accent}:${word.toLowerCase()}`;
    if (this.cache.has(key)) return this.cache.get(key)!;
    const arpa = this.arpabet(word);
    const result = arpa ? arpabetToPronunciation(arpa, accent, word) : null;
    if (this.dict) this.cache.set(key, result);
    return result;
  }
}
