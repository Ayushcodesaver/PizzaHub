import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { offerTerms } from "@/data/menu";
import { useOffers } from "@/lib/catalog";
import { waLink } from "@/lib/whatsapp";

export function OffersGrid() {
  const all = useOffers();
  const offers = all.filter((o) => o.kind === "combo");
  const deals = all.filter((o) => o.kind === "deal");
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        {offers.map((o, i) => (
          <article key={o.id} className={`flex flex-col rounded-3xl p-7 shadow-card ${i === 1 ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-75">Combo</p>
            <h3 className="mt-1 text-2xl font-extrabold">{o.title}</h3>
            <p className="price mt-3 text-5xl">₹{o.price}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {o.items.map((it) => (
                <li key={it} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0" />{it}</li>
              ))}
            </ul>
            <Button variant={i === 1 ? "cheese" : "hero"} size="xl" className="mt-auto pt-0 w-full" asChild>
              <a href={waLink(`Hi Subday Pizza! I'd like the ${o.title} combo (₹${o.price}).`)} target="_blank" rel="noreferrer" className="mt-6">Order this combo</a>
            </Button>
          </article>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {deals.map((d) => (
          <article key={d.id} className="flex items-center gap-5 rounded-3xl border-2 border-dashed border-primary/40 bg-accent p-6">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-cheese text-2xl">🎁</span>
            <div>
              <h3 className="text-xl font-extrabold">{d.title}</h3>
              <p className="text-muted-foreground">{d.text}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{offerTerms}</p>
    </div>
  );
}
