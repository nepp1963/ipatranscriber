import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/ipa/SiteChrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | IPA Transcriber" },
      { name: "description", content: "Get in touch with the IPA Transcriber team with feedback or pronunciation corrections." },
      { property: "og:title", content: "Contact | IPA Transcriber" },
      { property: "og:description", content: "Get in touch with the IPA Transcriber team with feedback or pronunciation corrections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SimplePage title="Contact">
      <p>Found a pronunciation that looks wrong, or have an idea for teachers and learners? We’d love to hear from you.</p>
      <p>Email: <a className="font-semibold text-primary underline" href="mailto:hello@ipatranscriber.app">hello@ipatranscriber.app</a></p>
    </SimplePage>
  ),
});
