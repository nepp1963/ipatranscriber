import type { Accent, Pronunciation, Syllable } from "./types";

/** Converts CMU ARPAbet phone strings into syllabified IPA for GA or RP. */

const VOWELS = new Set(["AA", "AE", "AH", "AO", "AW", "AY", "EH", "ER", "EY", "IH", "IY", "OW", "OY", "UH", "UW"]);

const CONS: Record<string, string> = {
  B: "b", CH: "tʃ", D: "d", DH: "ð", F: "f", G: "ɡ", HH: "h", JH: "dʒ", K: "k", L: "l",
  M: "m", N: "n", NG: "ŋ", P: "p", R: "r", S: "s", SH: "ʃ", T: "t", TH: "θ", V: "v",
  W: "w", Y: "j", Z: "z", ZH: "ʒ",
};

const US_V: Record<string, string> = {
  AA: "ɑ", AE: "æ", AO: "ɔ", AW: "aʊ", AY: "aɪ", EH: "ɛ", EY: "eɪ", IH: "ɪ", IY: "i",
  OW: "oʊ", OY: "ɔɪ", UH: "ʊ", UW: "u",
};
const UK_V: Record<string, string> = {
  AA: "ɑː", AE: "æ", AO: "ɔː", AW: "aʊ", AY: "aɪ", EH: "e", EY: "eɪ", IH: "ɪ", IY: "iː",
  OW: "əʊ", OY: "ɔɪ", UH: "ʊ", UW: "uː",
};
/** RP vowel + non-prevocalic R → centring diphthong / long vowel. */
const UK_R: Record<string, string> = {
  IH: "ɪə", IY: "ɪə", EH: "eə", EY: "eə", UH: "ʊə", UW: "ʊə", AA: "ɑː", AO: "ɔː",
  OW: "ɔː", AY: "aɪə", AW: "aʊə", AH: "ʌr", AE: "æ",
};

/** Common words with the RP "BATH" vowel /ɑː/ where GA has /æ/. */
const BATH = new Set([
  "ask", "bath", "path", "after", "fast", "last", "past", "class", "glass", "grass", "pass",
  "dance", "chance", "france", "plant", "can't", "half", "laugh", "answer", "example",
  "rather", "castle", "master", "branch", "demand", "command", "craft", "draft", "staff",
  "calf", "aunt", "advance", "disaster", "nasty", "basket", "task", "mask", "vast", "cast",
  "graph", "shan't", "afternoon", "photograph", "aftermath", "plaster", "rasp", "grasp",
  "clasp", "blast", "contrast", "forecast", "broadcast", "chant", "grant", "slant",
]);

const ONSETS = new Set([
  "P R", "P L", "B R", "B L", "T R", "D R", "K R", "K L", "G R", "G L", "F R", "F L",
  "TH R", "SH R", "S P", "S T", "S K", "S M", "S N", "S L", "S W", "S F", "T W", "D W",
  "K W", "G W", "TH W", "P Y", "B Y", "F Y", "V Y", "M Y", "K Y", "HH Y", "N Y", "L Y",
  "S P R", "S P L", "S T R", "S K R", "S K W", "S K Y", "S P Y", "S K L",
]);

function baseForms(word: string): string[] {
  const out = [word];
  for (const suf of ["s", "es", "ed", "ing", "er", "ers"]) {
    if (word.endsWith(suf)) {
      const b = word.slice(0, -suf.length);
      out.push(b, b + "e");
    }
  }
  return out;
}

function isBathWord(word: string) {
  return baseForms(word).some((w) => BATH.has(w));
}

function isLotSpelling(word: string) {
  return word.includes("o") || /(^|[^a-z])(w|qu)a/.test(word) || /^(w|qu|squ)a/.test(word);
}

interface Phone {
  base: string;
  stress: 0 | 1 | 2;
  vowel: boolean;
}

export function parseArpabet(arpa: string): Phone[] {
  return arpa
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => {
      const m = /^([A-Z]+)([012])?$/.exec(p);
      const base = m ? m[1]! : p;
      const stress = (m && m[2] ? Number(m[2]) : 0) as 0 | 1 | 2;
      return { base, stress, vowel: VOWELS.has(base!) };
    });
}

export function arpabetToPronunciation(arpa: string, accent: Accent, spelling = ""): Pronunciation {
  const phones = parseArpabet(arpa);
  const word = spelling.toLowerCase();
  const ipa: string[] = new Array(phones.length).fill("");
  let bathUsed = false;
  const lastVowelIdx = phones.map((p) => p.vowel).lastIndexOf(true);

  phones.forEach((p, i) => {
    if (!p.vowel) {
      ipa[i] = CONS[p.base] ?? p.base.toLowerCase();
      return;
    }
    const stressed = p.stress > 0;
    if (p.base === "AH") ipa[i] = stressed ? "ʌ" : "ə";
    else if (p.base === "ER") ipa[i] = accent === "us" ? (stressed ? "ɝ" : "ɚ") : stressed ? "ɜː" : "ə";
    else if (accent === "us") ipa[i] = US_V[p.base]!;
    else {
      let v = UK_V[p.base]!;
      if (p.base === "AA" && phones[i + 1]?.base !== "R" && isLotSpelling(word)) v = "ɒ";
      if (p.base === "AE" && stressed && !bathUsed && isBathWord(word)) {
        v = "ɑː";
        bathUsed = true;
      }
      if (p.base === "IY" && !stressed && i === lastVowelIdx) v = "i";
      if (p.base === "UW" && !stressed) v = "u";
      ipa[i] = v!;
    }
    if (p.base === "IY" && !stressed && accent === "us") ipa[i] = "i";
  });

  // RP is non-rhotic: drop R unless followed by a vowel.
  if (accent === "uk") {
    phones.forEach((p, i) => {
      if (p.base !== "R") return;
      const next = phones[i + 1];
      if (next && next.vowel) return;
      const prev = phones[i - 1];
      if (prev && prev.vowel && UK_R[prev.base]) {
        ipa[i - 1] = prev.base === "AH" && prev.stress === 0 ? "ə" : UK_R[prev.base]!.replace(/r$/, "");
        if (prev.base === "AH" && prev.stress > 0) ipa[i - 1] = "ɜː";
      }
      ipa[i] = "";
    });
  }

  return { syllables: syllabify(phones, ipa) };
}

function syllabify(phones: Phone[], ipa: string[]): Syllable[] {
  const nuclei = phones.map((p, i) => (p.vowel ? i : -1)).filter((i) => i >= 0);
  if (nuclei.length === 0) return [{ ipa: ipa.join(""), stress: 0 }];

  const starts: number[] = [0];
  for (let k = 1; k < nuclei.length; k++) {
    const a = nuclei[k - 1];
    const b = nuclei[k];
    if (a === undefined || b === undefined) continue;
    const cluster = phones.slice(a + 1, b).map((p) => p.base);
    let onsetLen = 0;
    for (let len = Math.min(3, cluster.length); len >= 1; len--) {
      const cand = cluster.slice(cluster.length - len);
      if (len === 1 ? cand[0] !== "NG" : ONSETS.has(cand.join(" "))) {
        onsetLen = len;
        break;
      }
    }
    starts.push(b - onsetLen);
  }

  return nuclei.map((n, k) => {
    const from = starts[k];
    const to = k + 1 < starts.length ? starts[k + 1] : phones.length;
    return { ipa: ipa.slice(from, to).join(""), stress: phones[n]!.stress };
  });
}
