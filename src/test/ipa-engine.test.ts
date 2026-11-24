import { describe, expect, it } from "vitest";
import { dictionary } from "cmu-pronouncing-dictionary";
import { CmuEngine } from "@/lib/ipa/cmu-engine";
import {
  compareTranscription,
  formatPronunciation,
  tokenize,
  tokensToText,
} from "@/lib/ipa/transcribe";

const engine = new CmuEngine(dictionary as Record<string, string>);
const fmt = (w: string, a: "us" | "uk", syl = false) =>
  formatPronunciation(engine.lookup(w, a)!, { showStress: true, showSyllables: syl });

describe("IPA engine", () => {
  it("American English", () => {
    expect(fmt("water", "us")).toBe("ˈwɔtɚ");
    expect(fmt("hello", "us")).toBe("həˈloʊ");
    expect(fmt("car", "us")).toBe("kɑr");
  });
  it("British English is non-rhotic with RP vowels", () => {
    expect(fmt("water", "uk")).toBe("ˈwɔːtə");
    expect(fmt("hello", "uk")).toBe("həˈləʊ");
    expect(fmt("car", "uk")).toBe("kɑː");
    expect(fmt("hot", "uk")).toBe("hɒt");
    expect(fmt("bath", "uk")).toBe("bɑːθ");
    expect(fmt("care", "uk")).toBe("keə");
  });
  it("syllable breaks", () => {
    expect(fmt("education", "us", true)).toBe("ˌɛ.dʒəˈkeɪ.ʃən");
  });
  it("unknown words return null", () => {
    expect(engine.lookup("qzxvbn", "us")).toBeNull();
  });
  it("wraps each generated word transcription in forward slashes", () => {
    const tokens = tokenize("the", engine, "us", { showStress: true, showSyllables: false });
    expect(tokensToText(tokens, true)).toBe("/ðə/");
  });
  it("practice comparison ignores stress unless strict", () => {
    expect(compareTranscription("hello", "həloʊ", engine, false).score).toBe(100);
    expect(compareTranscription("hello", "həloʊ", engine, true).score).toBe(0);
  });
});
