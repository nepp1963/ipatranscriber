import { Clock, Copy, Download, Eraser, FileText, GraduationCap, Keyboard, Loader2, RotateCcw, Settings2, Sparkles, Trash2, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebounced, usePersisted } from "@/hooks/use-persisted";
import { copyText, downloadText, exportPdf, speak } from "@/lib/export";
import { countWords, getEngine, tokenize, tokensToText, type Accent } from "@/lib/ipa";
import { addToHistory, DEFAULT_SETTINGS, SETTING_LABELS, type HistoryItem, type Settings } from "@/lib/settings";
import { Legend } from "./Legend";
import { OutputView } from "./OutputView";
import { PracticeMode } from "./PracticeMode";
import { Footer, Logo, ThemeSwitcher } from "./SiteChrome";
import { TeacherView } from "./TeacherView";
import { WordAnalyzer } from "./WordAnalyzer";

const ACCENTS: { v: Accent; label: string; short: string }[] = [
  { v: "us", label: "American English (General American)", short: "American" },
  { v: "uk", label: "British English (Received Pronunciation)", short: "British" },
];

const SAMPLE = "Welcome to the IPA Transcriber.\nType any English sentence and see its pronunciation instantly.";

export function Transcriber() {
  const [text, setText] = useState(SAMPLE);
  const [accent, setAccent] = usePersisted<{ v: Accent }>("ipa-accent", { v: "us" });
  const [settings, setSettings] = usePersisted<Settings>("ipa-settings", DEFAULT_SETTINGS);
  const [history, setHistory] = usePersisted<HistoryItem[]>("ipa-history", []);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const engine = getEngine();
  const a = accent.v;

  useEffect(() => {
    engine.load().then(() => setReady(true)).catch(() => toast.error("Could not load the pronunciation dictionary."));
  }, [engine]);

  const debounced = useDebounced(text, text.length > 4000 ? 250 : 90);
  const opts = useMemo(() => ({ showStress: settings.showStress, showSyllables: settings.showSyllables }), [settings.showStress, settings.showSyllables]);
  const tokens = useMemo(() => (ready ? tokenize(debounced, engine, a, opts) : []), [ready, debounced, engine, a, opts]);
  const ipaText = useMemo(() => tokensToText(tokens, settings.preservePunctuation), [tokens, settings.preservePunctuation]);
  const lines = useMemo(() => (ready ? debounced.split("\n").map((l) => tokenize(l, engine, a, opts)) : []), [ready, debounced, engine, a, opts]);
  const unknown = tokens.filter((t) => t.kind === "word" && !t.pron).length;
  const words = countWords(text);

  // Save history + auto-copy once typing settles.
  const settled = useDebounced(debounced, 1500);
  useEffect(() => {
    if (!ready || !settled.trim()) return;
    setHistory((h) => (h[0]?.text === settled && h[0]?.accent === a ? h : addToHistory(h, { id: crypto.randomUUID(), text: settled, accent: a, at: Date.now() })));
    if (settings.autoCopy && ipaText) copyText(ipaText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled, a, ready]);

  const onCopy = useCallback(async () => {
    if (!ipaText.trim()) return toast.error("Nothing to copy yet.");
    if (await copyText(ipaText)) toast.success("IPA copied successfully.");
  }, [ipaText]);
  const onClear = useCallback(() => {
    setText("");
    setSelected(null);
    inputRef.current?.focus();
  }, []);
  const accentLabel = ACCENTS.find((x) => x.v === a)!.label;
  const onSpeak = useCallback(() => text.trim() && speak(text, a), [text, a]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && e.code === "KeyC") { e.preventDefault(); onCopy(); }
      else if (mod && e.shiftKey && e.code === "KeyX") { e.preventDefault(); onClear(); }
      else if (e.altKey && e.code === "Digit1") { e.preventDefault(); setAccent({ v: "us" }); }
      else if (e.altKey && e.code === "Digit2") { e.preventDefault(); setAccent({ v: "uk" }); }
      else if (e.altKey && e.code === "KeyP") { e.preventDefault(); onSpeak(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onCopy, onClear, onSpeak, setAccent]);

  const exportTxt = () => ipaText.trim() && downloadText("ipa-transcription.txt", ipaText);
  const exportFull = () => text.trim() && downloadText("transcription.txt", `IPA Transcriber — ${accentLabel}\n${new Date().toLocaleString()}\n\nORIGINAL\n${debounced}\n\nIPA\n${ipaText}\n`);
  const onPdf = () => ipaText.trim() && (exportPdf(debounced, ipaText, accentLabel) || toast.error("Please allow pop-ups to export PDF."));

  const settingsPanel = (
    <div className="space-y-1">
      {(Object.keys(SETTING_LABELS) as (keyof Settings)[]).map((k) => (
        <div key={k} className="flex items-center justify-between gap-4 rounded-xl p-3 hover:bg-muted">
          <Label htmlFor={`s-${k}`} className="flex cursor-pointer flex-col items-start gap-0.5">
            <span>{SETTING_LABELS[k].label}</span>
            <span className="text-xs font-normal text-muted-foreground">{SETTING_LABELS[k].hint}</span>
          </Label>
          <Switch id={`s-${k}`} checked={settings[k]} onCheckedChange={(v) => setSettings((s) => ({ ...s, [k]: v }))} />
        </div>
      ))}
      <div className="mt-6 rounded-xl border p-4 text-sm">
        <p className="mb-2 flex items-center gap-2 font-semibold"><Keyboard className="size-4" /> Keyboard shortcuts</p>
        <ul className="space-y-1 text-muted-foreground">
          <li><kbd>Ctrl/⌘ + Shift + C</kbd> Copy IPA</li>
          <li><kbd>Ctrl/⌘ + Shift + X</kbd> Clear</li>
          <li><kbd>Alt + 1 / Alt + 2</kbd> American / British</li>
          <li><kbd>Alt + P</kbd> Play pronunciation</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2">Skip to content</a>
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="icon" aria-label="Open settings" className="rounded-full"><Settings2 /></Button></SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Settings</SheetTitle><SheetDescription>Customise how IPA is displayed.</SheetDescription></SheetHeader>
                <div className="px-4">{settingsPanel}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="bg-hero">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 text-center md:pt-20">
          <p className="animate-rise mx-auto inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-soft"><Sparkles className="size-3.5 text-primary" /> 134,000+ word pronunciation dictionary</p>
          <h1 className="animate-rise mt-5 text-4xl font-extrabold md:text-6xl">English to <span className="text-brand">IPA</span>, instantly.</h1>
          <p className="animate-rise mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Type or paste English and get accurate phonetic transcription in American or British pronunciation — built for ESL learners and teachers.</p>
          <p className="font-ipa animate-rise mt-4 text-xl text-primary" aria-hidden>/ˌɪntɚˈnæʃənəl fəˈnɛtɪk ˈælfəˌbɛt/</p>
        </div>
      </section>

      <main id="main" className="mx-auto max-w-6xl space-y-12 px-4">
        <Tabs defaultValue="transcribe" className="-mt-2">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <TabsList aria-label="Mode">
              <TabsTrigger value="transcribe">Transcribe</TabsTrigger>
              <TabsTrigger value="teacher"><GraduationCap className="size-4" /> Teacher</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>
            <div role="radiogroup" aria-label="Accent" className="flex rounded-xl border bg-card p-1 shadow-soft">
              {ACCENTS.map((x) => (
                <button key={x.v} role="radio" aria-checked={a === x.v} aria-label={x.label} onClick={() => setAccent({ v: x.v })}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${a === x.v ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`}>
                  {x.v === "us" ? "🇺🇸" : "🇬🇧"} {x.short}<span className="hidden md:inline"> · {x.v === "us" ? "GA" : "RP"}</span>
                </button>
              ))}
            </div>
          </div>

          <TabsContent value="transcribe" className="mt-4">
            <div className="grid gap-5 lg:grid-cols-2">
              <section aria-labelledby="in-h" className="flex flex-col rounded-3xl border bg-card p-5 shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <h2 id="in-h" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">English text</h2>
                  <Button variant="ghost" size="sm" onClick={onClear} aria-label="Clear input and output"><Eraser /> Clear</Button>
                </div>
                <Textarea ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} aria-label="English text to transcribe" placeholder="Start typing English here…" spellCheck
                  className="field-sizing-content min-h-[260px] flex-1 resize-y rounded-2xl border-0 bg-surface p-4 text-lg leading-relaxed shadow-none focus-visible:ring-2 md:text-lg" />
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground" aria-live="polite">
                  <span>{text.length.toLocaleString()} characters · {words.toLocaleString()} words</span>
                  <Button variant="ghost" size="sm" onClick={onSpeak} disabled={!text.trim()} aria-label="Hear pronunciation"><Volume2 /> Listen</Button>
                </div>
              </section>

              <section aria-labelledby="out-h" className="flex flex-col rounded-3xl border bg-card p-5 shadow-soft">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 id="out-h" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">IPA · {a === "us" ? "General American" : "Received Pronunciation"}</h2>
                  <Button size="sm" onClick={onCopy} disabled={!ipaText.trim()} className="shadow-glow"><Copy /> Copy IPA</Button>
                </div>
                <div role="region" aria-label="IPA transcription output" aria-readonly="true" aria-live="polite" className="min-h-[260px] flex-1 rounded-2xl bg-surface p-4">
                  {!ready ? (
                    <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading pronunciation dictionary…</p>
                  ) : tokens.length ? (
                    <OutputView tokens={tokens} preservePunctuation={settings.preservePunctuation} highlightUnknown={settings.highlightUnknown} selected={selected} onSelect={setSelected} />
                  ) : (
                    <p className="text-muted-foreground">Your IPA transcription will appear here.</p>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{unknown > 0 ? `${unknown} unknown word${unknown > 1 ? "s" : ""}` : "Tip: click a word for details"}</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Button variant="outline" size="sm" onClick={exportTxt} disabled={!ipaText.trim()}><FileText /> TXT</Button>
                    <Button variant="outline" size="sm" onClick={onPdf} disabled={!ipaText.trim()}><FileText /> PDF</Button>
                    <Button variant="outline" size="sm" onClick={exportFull} disabled={!ipaText.trim()}><Download /> Download</Button>
                  </div>
                </div>
              </section>
            </div>
            {selected && <div className="mt-5"><WordAnalyzer word={selected} accent={a} onClose={() => setSelected(null)} /></div>}
          </TabsContent>

          <TabsContent value="teacher" className="mt-4 space-y-4">
            <div className="rounded-3xl border bg-card p-5 shadow-soft">
              <h2 className="text-xl font-bold">Teacher Mode</h2>
              <p className="text-sm text-muted-foreground">Line-by-line view with word-by-word pronunciation help. Click any word to hear it.</p>
              <Textarea value={text} onChange={(e) => setText(e.target.value)} aria-label="Lesson text" className="field-sizing-content mt-3 min-h-28 bg-surface text-base" />
            </div>
            {ready && <TeacherView text={debounced} lines={lines} accent={a} preservePunctuation={settings.preservePunctuation} />}
          </TabsContent>

          <TabsContent value="practice" className="mt-4">
            <div className="rounded-3xl border bg-card p-5 shadow-soft">
              <h2 className="text-xl font-bold">Student Practice</h2>
              <p className="mb-4 text-sm text-muted-foreground">Write your own transcription and compare it with the system. American and British answers are both accepted.</p>
              <PracticeMode ready={ready} />
            </div>
          </TabsContent>
        </Tabs>

        <section aria-labelledby="legend-h">
          <h2 id="legend-h" className="mb-4 text-2xl font-bold">IPA legend</h2>
          <Legend />
        </section>

        <section aria-labelledby="hist-h">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="hist-h" className="text-2xl font-bold">History</h2>
            {history.length > 0 && <Button variant="ghost" size="sm" onClick={() => setHistory([])}><Trash2 /> Clear history</Button>}
          </div>
          {history.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">Your last 20 transcriptions are saved on this device.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {history.map((h) => (
                <li key={h.id} className="group flex items-start justify-between gap-3 rounded-2xl border bg-card p-4 shadow-soft">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="size-3" /><time dateTime={new Date(h.at).toISOString()}>{new Date(h.at).toLocaleString()}</time> · {h.accent === "us" ? "American" : "British"}</p>
                    <p className="mt-1 line-clamp-2">{h.text}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { setText(h.text); setAccent({ v: h.accent }); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label={`Restore: ${h.text.slice(0, 40)}`}><RotateCcw /> Restore</Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
