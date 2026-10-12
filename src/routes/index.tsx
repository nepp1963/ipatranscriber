import { createFileRoute } from "@tanstack/react-router";
import { Transcriber } from "@/components/ipa/Transcriber";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IPA Transcriber | English to IPA Converter" },
      { name: "description", content: "Convert English text into accurate IPA phonetic transcription using American or British pronunciation." },
      { property: "og:title", content: "IPA Transcriber | English to IPA Converter" },
      { property: "og:description", content: "Convert English text into accurate IPA phonetic transcription using American or British pronunciation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Transcriber,
});
