import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Subday Pizza" },
      { name: "description", content: "How Subday Pizza handles your information." },
      { property: "og:title", content: "Privacy Policy — Subday Pizza" },
      { property: "og:description", content: "How we handle your information." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 text-muted-foreground">
        <p>If you create an account we store your email address so you can sign in. We don't sell your information.</p>
        <p>Orders are sent through WhatsApp; messages you send are handled under WhatsApp's own privacy terms.</p>
        <p>Your current order is saved only in your browser until you send or clear it.</p>
        <p>Questions? Call us on 8796130029.</p>
      </div>
    </>
  ),
});
