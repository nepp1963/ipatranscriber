import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tokensToText, type Accent, type Token } from "@/lib/ipa";
import { speak } from "@/lib/export";

export function TeacherView({
  text,
  lines,
  accent,
  preservePunctuation,
}: {
  text: string;
  lines: Token[][];
  accent: Accent;
  preservePunctuation: boolean;
}) {
  const original = text.split("\n");
  if (!text.trim())
    return (
      <p className="py-10 text-center text-muted-foreground">
        Type text above to build a lesson view.
      </p>
    );
  return (
    <ol className="space-y-4">
      {lines.map((tokens, i) =>
        original[i]?.trim() ? (
          <li key={i} className="rounded-2xl border bg-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Line {i + 1}
                </p>
                <p className="mt-1 text-lg">{original[i]}</p>
                <p className="font-ipa mt-1 text-xl text-primary">
                  {tokensToText(tokens, preservePunctuation).trim()}
                </p>
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => speak(original[i] ?? "", accent)}
                aria-label={`Hear line ${i + 1}`}
              >
                <Volume2 />
              </Button>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Word by word">
              {tokens
                .filter((t) => t.kind === "word")
                .map((t, j) => (
                  <li key={j}>
                    <button
                      type="button"
                      onClick={() => speak(t.text, accent)}
                      className="flex flex-col items-center rounded-xl border bg-surface px-3 py-1.5 transition hover:-translate-y-0.5 hover:border-primary"
                      aria-label={`${t.text}: ${t.kind === "word" && t.pron ? t.ipa : "pronunciation unavailable"}. Play`}
                    >
                      <span className="text-sm font-medium">{t.text}</span>
                      <span
                        className={`font-ipa text-lg ${t.kind === "word" && t.pron ? "text-primary" : "text-warning"}`}
                      >
                        {t.kind === "word" && t.pron ? t.ipa : "?"}
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </li>
        ) : null,
      )}
    </ol>
  );
}
