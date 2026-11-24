import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { compareTranscription, getEngine } from "@/lib/ipa";

const KEYS = [
  "ˈ",
  "ˌ",
  "ː",
  "ə",
  "ɪ",
  "ʊ",
  "æ",
  "ʌ",
  "ɑ",
  "ɒ",
  "ɔ",
  "ɜ",
  "ɝ",
  "ɚ",
  "θ",
  "ð",
  "ʃ",
  "ʒ",
  "ŋ",
  "ɡ",
  "tʃ",
  "dʒ",
];

export function PracticeMode({ ready }: { ready: boolean }) {
  const [sentence, setSentence] = useState("The weather is nice today");
  const [attempt, setAttempt] = useState("");
  const [strict, setStrict] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof compareTranscription> | null>(null);

  const check = () => setResult(compareTranscription(sentence, attempt, getEngine(), strict));

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="p-sentence">Sentence</Label>
        <Input
          id="p-sentence"
          value={sentence}
          onChange={(e) => {
            setSentence(e.target.value);
            setResult(null);
          }}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="p-attempt">Your IPA transcription (one word per space)</Label>
        <Input
          id="p-attempt"
          className="font-ipa text-lg"
          value={attempt}
          placeholder="ðə ˈwɛðɚ ɪz naɪs təˈdeɪ"
          onChange={(e) => setAttempt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <div className="flex flex-wrap gap-1" aria-label="IPA keyboard">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setAttempt((a) => a + k)}
              className="font-ipa min-w-9 rounded-lg border bg-card px-2 py-1 text-lg hover:border-primary hover:bg-secondary"
              aria-label={`Insert ${k}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={check} disabled={!ready || !sentence.trim()}>
          Check my answer
        </Button>
        <div className="flex items-center gap-2">
          <Switch id="strict" checked={strict} onCheckedChange={setStrict} />
          <Label htmlFor="strict">Require stress marks</Label>
        </div>
      </div>
      {result && (
        <div className="animate-rise space-y-3" aria-live="polite">
          <p className="text-lg font-semibold">
            Score:{" "}
            <span
              className={
                result.score >= 80
                  ? "text-success"
                  : result.score >= 50
                    ? "text-warning"
                    : "text-destructive"
              }
            >
              {result.score}%
            </span>
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {result.results.map((r, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 rounded-xl border p-3 ${r.correct ? "border-success/50" : "border-destructive/50"}`}
              >
                {r.correct ? (
                  <Check className="mt-0.5 size-4 text-success" aria-label="Correct" />
                ) : (
                  <X className="mt-0.5 size-4 text-destructive" aria-label="Incorrect" />
                )}
                <div className="text-sm">
                  <p className="font-semibold">{r.word}</p>
                  <p>
                    You: <span className="font-ipa text-base">{r.given || "—"}</span>
                  </p>
                  {!r.correct && (
                    <p>
                      Expected:{" "}
                      <span className="font-ipa text-base text-primary">
                        {r.expected.length
                          ? r.expected.map((ipa) => `/${ipa}/`).join("  or  ")
                          : "unavailable"}
                      </span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
