import { AlertTriangle } from "lucide-react";
import { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Token } from "@/lib/ipa";

interface Props {
  tokens: Token[];
  preservePunctuation: boolean;
  highlightUnknown: boolean;
  selected: string | null;
  onSelect: (word: string) => void;
}

export const OutputView = memo(function OutputView({
  tokens,
  preservePunctuation,
  highlightUnknown,
  selected,
  onSelect,
}: Props) {
  return (
    <div
      className="font-ipa whitespace-pre-wrap break-words text-xl leading-[2.1] md:text-2xl"
      lang="en-fonipa"
    >
      {tokens.map((t, i) => {
        if (t.kind === "space") return <span key={i}>{t.text}</span>;
        if (t.kind === "punct")
          return preservePunctuation ? (
            <span key={i} className="text-muted-foreground">
              {t.text}
            </span>
          ) : null;
        if (!t.pron) {
          if (!highlightUnknown)
            return (
              <span key={i} className="text-muted-foreground">
                {t.text}
              </span>
            );
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <span
                  tabIndex={0}
                  className="inline-flex items-center gap-0.5 rounded-md bg-warning-soft px-1 font-sans text-base text-foreground underline decoration-warning decoration-wavy underline-offset-4"
                  aria-label={`${t.text}: Pronunciation unavailable`}
                >
                  <AlertTriangle className="size-3.5 text-warning" aria-hidden />
                  {t.text}
                </span>
              </TooltipTrigger>
              <TooltipContent>Pronunciation unavailable.</TooltipContent>
            </Tooltip>
          );
        }
        const active = selected?.toLowerCase() === t.text.toLowerCase();
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(t.text)}
            title={t.text}
            aria-label={`${t.text}, ${t.ipa}. Show word details`}
            className={`rounded-md px-0.5 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring ${active ? "bg-accent text-accent-foreground" : ""}`}
          >
            {t.ipa}
          </button>
        );
      })}
    </div>
  );
});
