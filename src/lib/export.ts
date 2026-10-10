export function downloadText(filename: string, content: string) {
  // BOM ensures Windows Notepad reads UTF-8 IPA symbols correctly.
  const blob = new Blob(["\uFEFF" + content.normalize("NFC")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

/** Opens a print-ready page; the browser's "Save as PDF" embeds the IPA font. */
export function exportPdf(original: string, ipa: string, accentLabel: string) {
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>IPA Transcription</title>
<link href="https://fonts.googleapis.com/css2?family=Charis+SIL:wght@400;700&display=swap" rel="stylesheet">
<style>body{font-family:'Charis SIL','Doulos SIL','Noto Sans',serif;max-width:720px;margin:40px auto;padding:0 24px;color:#1b1b2f}
h1{font-size:20px;margin:0 0 4px}small{color:#666}h2{font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#555;margin-top:28px}
pre{white-space:pre-wrap;font-family:inherit;font-size:18px;line-height:1.7;margin:0}</style></head>
<body><h1>IPA Transcription</h1><small>${esc(accentLabel)} · ${new Date().toLocaleString()}</small>
<h2>Original text</h2><pre>${esc(original)}</pre><h2>IPA</h2><pre>${esc(ipa)}</pre>
<script>document.fonts.ready.then(function(){setTimeout(function(){window.print()},300)})</script></body></html>`);
  w.document.close();
  return true;
}

export async function copyText(text: string) {
  const t = text.normalize("NFC");
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function speak(text: string, accent: "us" | "uk") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const lang = accent === "us" ? "en-US" : "en-GB";
  u.lang = lang;
  const voice = synth.getVoices().find((v) => v.lang.replace("_", "-") === lang);
  if (voice) u.voice = voice;
  u.rate = 0.9;
  synth.speak(u);
  return true;
}
