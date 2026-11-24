import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/ipa/SiteChrome";

export const Route = createFileRoute("/manual")({
  head: () => ({
    meta: [
      { title: "User Manual | IPA Transcriber" },
      {
        name: "description",
        content:
          "Instructions for transcribing English text, using pronunciation tools, and practicing IPA with IPA Transcriber.",
      },
      { property: "og:title", content: "User Manual | IPA Transcriber" },
      {
        property: "og:description",
        content:
          "Instructions for transcribing English text, using pronunciation tools, and practicing IPA with IPA Transcriber.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SimplePage title="User manual">
      <section aria-labelledby="manual-transcribe">
        <h2 id="manual-transcribe" className="text-xl font-semibold text-foreground">
          Transcribe text
        </h2>
        <p>
          Enter or paste English in the text box. The pronunciation appears alongside it as you
          type. Each transcribed word is shown between forward slashes, for example{" "}
          <span className="font-ipa text-foreground">/ðə/</span>.
        </p>
        <p>
          Choose American or British pronunciation above the text boxes. Select a word in the output
          to see its syllables and stress. Words unavailable in the dictionary are marked with a
          warning.
        </p>
      </section>
      <section aria-labelledby="manual-tools">
        <h2 id="manual-tools" className="text-xl font-semibold text-foreground">
          Listen and save
        </h2>
        <p>
          Use Listen to hear the original text, or select a transcribed word to open its details.
          Copy IPA places the transcription on your clipboard. TXT saves the IPA, PDF opens a
          print-ready page, and Download saves both the English text and its transcription.
        </p>
      </section>
      <section aria-labelledby="manual-modes">
        <h2 id="manual-modes" className="text-xl font-semibold text-foreground">
          Teacher and practice modes
        </h2>
        <p>
          Teacher mode separates your text into lines and provides pronunciation buttons for each
          line and word. Practice mode lets you enter one IPA word per space and compare your answer
          with American and British pronunciations. Turn on Require stress marks to include stress
          in the comparison.
        </p>
      </section>
      <section aria-labelledby="manual-settings">
        <h2 id="manual-settings" className="text-xl font-semibold text-foreground">
          Settings and history
        </h2>
        <p>
          Open Settings to show or hide stress marks, syllable breaks, punctuation, or warnings for
          unknown words. Auto-copy copies the output after you stop typing. Your latest 20
          transcriptions are saved on this device; restore one from History or clear the list there.
        </p>
      </section>
    </SimplePage>
  ),
});
