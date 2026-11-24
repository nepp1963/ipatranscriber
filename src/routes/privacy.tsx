import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/ipa/SiteChrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy | IPA Transcriber" },
      {
        name: "description",
        content: "IPA Transcriber processes your text in your browser. Nothing is uploaded.",
      },
      { property: "og:title", content: "Privacy | IPA Transcriber" },
      {
        property: "og:description",
        content: "IPA Transcriber processes your text in your browser. Nothing is uploaded.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SimplePage title="Privacy">
      <p>All transcription happens in your browser. The text you type is never sent to a server.</p>
      <p>
        Your history (last 20 entries), settings and theme are stored only on this device using
        local storage. Clear them anytime with “Clear history” or your browser settings.
      </p>
      <p>No account is required and no tracking cookies are used.</p>
    </SimplePage>
  ),
});
