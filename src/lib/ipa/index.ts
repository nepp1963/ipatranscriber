import { CmuEngine } from "./cmu-engine";
import type { PronunciationEngine } from "./types";

export * from "./types";
export * from "./transcribe";

let engine: PronunciationEngine | null = null;

/** Single place to swap the pronunciation backend. */
export function getEngine(): PronunciationEngine {
  if (!engine) engine = new CmuEngine();
  return engine;
}
