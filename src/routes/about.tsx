import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/ipa/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | IPA Transcriber" },
      {
        name: "description",
        content: "How IPA Transcriber converts English text to American and British IPA.",
      },
      { property: "og:title", content: "About | IPA Transcriber" },
      {
        property: "og:description",
        content: "How IPA Transcriber converts English text to American and British IPA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SimplePage title="About">
      <p>
        IPA Transcriber turns English text into International Phonetic Alphabet transcription in
        real time, for ESL learners, teachers and anyone curious about pronunciation.
      </p>
      <p>
        Pronunciations come from the CMU Pronouncing Dictionary (over 134,000 words). American
        output follows General American; British output is derived for Received Pronunciation,
        including non-rhotic r, the LOT vowel /ɒ/ and the BATH vowel /ɑː/.
      </p>
      <p>
        Like any dictionary-based tool, rare names or new words may be unavailable — these are
        clearly highlighted.
      </p>
    </SimplePage>
  ),
});
