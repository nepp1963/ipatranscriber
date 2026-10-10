import type { Accent, FormatOptions, Pronunciation, PronunciationEngine } from "./types";

export type Token =
  | { kind: "word"; text: string; pron: Pronunciation | null; ipa: string }
  | { kind: "space"; text: string }
  | { kind: "punct"; text: string };

const TOKEN_RE = /([A-Za-z]+(?:['’][A-Za-z]+)*)|(\s+)|([^A-Za-z\s]+)/g;

export function formatPronunciation(pron: Pronunciation, opts: FormatOptions): string {
  const multi = pron.syllables.length > 1;
  return pron.syllables
    .map((s, i) => {
      const mark = opts.showStress && multi ? (s.stress === 1 ? "ˈ" : s.stress === 2 ? "ˌ" : "") : "";
      const sep = i > 0 && opts.showSyllables && !mark ? "." : "";
      return sep + mark + s.ipa;
    })
    .join("")
    .normalize("NFC");
}

export function tokenize(
  text: string,
  engine: PronunciationEngine,
  accent: Accent,
  opts: FormatOptions,
): Token[] {
  const tokens: Token[] = [];
  for (const m of text.matchAll(TOKEN_RE)) {
    if (m[1]) {
      const pron = engine.lookup(m[1], accent);
      tokens.push({ kind: "word", text: m[1], pron, ipa: pron ? formatPronunciation(pron, opts) : m[1] });
    } else if (m[2]) tokens.push({ kind: "space", text: m[2] });
    else tokens.push({ kind: "punct", text: m[3] });
  }
  return tokens;
}

export function tokensToText(tokens: Token[], preservePunctuation: boolean): string {
  return tokens
    .map((t) => (t.kind === "word" ? t.ipa : t.kind === "space" ? t.text : preservePunctuation ? t.text : ""))
    .join("")
    .normalize("NFC");
}

export function countWords(text: string) {
  const m = text.match(/[A-Za-z0-9]+(?:['’][A-Za-z]+)*/g);
  return m ? m.length : 0;
}

/** Strips marks so learner input can be compared leniently. */
export function normalizeIpa(s: string, keepStress = false): string {
  let out = s
    .normalize("NFC")
    .replace(/[/[\]]/g, "")
    .replace(/'/g, "ˈ")
    .replace(/,/g, "ˌ")
    .replace(/g/g, "ɡ")
    .replace(/ɹ/g, "r")
    .replace(/[.‿]/g, "")
    .replace(/ː/g, "ː")
    .trim();
  if (!keepStress) out = out.replace(/[ˈˌ]/g, "");
  return out;
}

export interface WordResult {
  word: string;
  expected: string[];
  given: string;
  correct: boolean;
}

/** Compare a learner's IPA (space separated per word) with system transcriptions. */
export function compareTranscription(
  sentence: string,
  attempt: string,
  engine: PronunciationEngine,
  strictStress: boolean,
): { results: WordResult[]; score: number } {
  const words = sentence.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? [];
  const given = attempt.trim().split(/\s+/).filter(Boolean);
  const opts = { showStress: true, showSyllables: false };
  const results = words.map((word, i) => {
    const expected = (["us", "uk"] as Accent[])
      .map((a) => engine.lookup(word, a))
      .filter((p): p is Pronunciation => !!p)
      .map((p) => formatPronunciation(p, opts));
    const g = given[i] ?? "";
    const gn = normalizeIpa(g, strictStress);
    const correct = !!g && expected.some((e) => normalizeIpa(e, strictStress) === gn);
    return { word, expected: [...new Set(expected)], given: g, correct };
  });
  const score = results.length ? Math.round((results.filter((r) => r.correct).length / results.length) * 100) : 0;
  return { results, score };
}
