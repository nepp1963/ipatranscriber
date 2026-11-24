import { Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPronunciation, getEngine, type Accent } from "@/lib/ipa";
import { speak } from "@/lib/export";

export function WordAnalyzer({
  word,
  accent,
  onClose,
}: {
  word: string;
  accent: Accent;
  onClose: () => void;
}) {
  const pron = getEngine().lookup(word, accent);
  if (!pron) return null;
  const ipa = formatPronunciation(pron, { showStress: true, showSyllables: true });
  const primary = pron.syllables.findIndex((s) => s.stress === 1);
  const secondary = pron.syllables.map((s, i) => (s.stress === 2 ? i + 1 : 0)).filter(Boolean);
  const stats = [
    { k: "Syllables", v: String(pron.syllables.length) },
    { k: "Primary stress", v: primary >= 0 ? `Syllable ${primary + 1}` : "—" },
    { k: "Secondary stress", v: secondary.length ? `Syllable ${secondary.join(", ")}` : "None" },
  ];
  return (
    <section
      aria-live="polite"
      aria-label={`Word analysis for ${word}`}
      className="animate-rise rounded-2xl border bg-surface p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Word analyzer
          </p>
          <p className="mt-1 text-lg font-semibold">{word}</p>
          <p className="font-ipa text-2xl text-primary">/{ipa}/</p>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => speak(word, accent)}
            aria-label={`Hear ${word}`}
          >
            <Volume2 />
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close word analyzer">
            <X />
          </Button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Syllables">
        {pron.syllables.map((s, i) => (
          <span
            key={i}
            className={`font-ipa rounded-lg border px-2.5 py-1 text-lg ${s.stress === 1 ? "border-primary bg-secondary text-secondary-foreground" : s.stress === 2 ? "border-accent-foreground/40 bg-accent text-accent-foreground" : "bg-card"}`}
          >
            {s.stress === 1 ? "ˈ" : s.stress === 2 ? "ˌ" : ""}
            {s.ipa}
          </span>
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
        {stats.map((s) => (
          <div key={s.k} className="rounded-xl bg-card p-2.5">
            <dt className="text-xs text-muted-foreground">{s.k}</dt>
            <dd className="font-semibold">{s.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
