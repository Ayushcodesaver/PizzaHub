import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { OffersGrid } from "@/components/site/Offers";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Combos — Subday Pizza" },
      { name: "description", content: "Meal for Two ₹450, Meal for Three ₹550, Meal for Four ₹800 plus pizza and burger deals at Subday Pizza." },
      { property: "og:title", content: "Subday Pizza Offers & Combos" },
      { property: "og:description", content: "Value combos from ₹450 and buy-2 pizza deals." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Offers & combos" title="More food. Better value.">
        Combos built for sharing with friends and family.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4"><OffersGrid /></div>
    </>
  ),
});
