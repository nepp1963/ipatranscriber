import { Link } from "@tanstack/react-router";
import { Monitor, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme, type ThemeMode } from "@/hooks/use-theme";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="IPA Transcriber home">
      <span className="bg-brand font-ipa grid size-9 place-items-center rounded-xl text-xl text-primary-foreground shadow-glow">
        ə
      </span>
      <span className="font-display text-lg font-bold tracking-tight">IPA Transcriber</span>
    </Link>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const opts: { v: ThemeMode; icon: ReactNode; label: string }[] = [
    { v: "light", icon: <Sun className="size-4" />, label: "Light mode" },
    { v: "dark", icon: <Moon className="size-4" />, label: "Dark mode" },
    { v: "system", icon: <Monitor className="size-4" />, label: "System theme" },
  ];
  return (
    <div role="radiogroup" aria-label="Theme" className="flex rounded-full border bg-card p-0.5">
      {opts.map((o) => (
        <button
          key={o.v}
          role="radio"
          aria-checked={theme === o.v}
          aria-label={o.label}
          title={o.label}
          onClick={() => setTheme(o.v)}
          className={`grid size-8 place-items-center rounded-full transition ${theme === o.v ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} IPA Transcriber. Built for ESL learners &amp; teachers.</p>
        <nav aria-label="Footer" className="flex gap-6">
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/manual" className="hover:text-foreground">
            User manual
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
      <p className="border-t py-4 text-center text-sm text-muted-foreground">
        IPA Transcriber by{" "}
        <a
          href="https://web.facebook.com/neppnft/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          nepp1963
        </a>
      </p>
    </footer>
  );
}

export function SimplePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Logo />
        <ThemeSwitcher />
      </header>
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
