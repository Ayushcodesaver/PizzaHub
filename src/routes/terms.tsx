import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Subday Pizza" },
      { name: "description", content: "Terms for ordering and offers at Subday Pizza." },
      { property: "og:title", content: "Terms & Conditions — Subday Pizza" },
      { property: "og:description", content: "Ordering and offer terms." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 text-muted-foreground">
        <p>Prices and offers shown are as advertised and may change. Please confirm with the restaurant when ordering.</p>
        <p>An order is only confirmed once the restaurant replies to your WhatsApp message or call.</p>
        <p>Free delivery applies to orders of ₹399 or more within 3 km.</p>
        <p>Offers cannot be combined unless stated by the restaurant.</p>
      </div>
    </>
  ),
});
