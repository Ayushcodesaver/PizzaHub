import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MenuCard } from "@/components/site/MenuCard";
import { PageHeader } from "@/components/site/PageHeader";
import { categories, menu } from "@/data/menu";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu & Prices — Subday Pizza Gurugram" },
      { name: "description", content: "Full Subday Pizza menu: veg pizzas, burgers, sandwiches, pasta, fries, wraps, mojitos, shakes and coffee with prices in ₹." },
      { property: "og:title", content: "Subday Pizza Menu" },
      { property: "og:description", content: "Browse pizzas, burgers, shakes and more with prices." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => menu.filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase())), [q]);
  const groups = categories.map((c) => ({ c, items: filtered.filter((m) => m.category === c.id) })).filter((g) => g.items.length);

  return (
    <>
      <PageHeader eyebrow="Our menu" title="Everything, freshly made.">
        All prices in ₹. Pizza sizes shown as Small / Medium / Large.
      </PageHeader>
      <div className="sticky top-16 z-30 border-y border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes…" className="h-11 rounded-full bg-card pl-9" aria-label="Search menu" />
          </div>
          <nav className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Categories">
            {groups.map(({ c }) => (
              <a key={c.id} href={`#${c.id}`} className="shrink-0 rounded-full bg-card px-4 py-2 text-sm font-semibold shadow-card hover:bg-secondary">
                {c.emoji} {c.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10">
        {groups.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-5xl">🍕</p>
            <p className="mt-4 text-lg font-semibold">No dishes match “{q}”.</p>
            <p className="text-muted-foreground">Try “paneer”, “shake” or “fries”.</p>
          </div>
        )}
        {groups.map(({ c, items }) => (
          <section key={c.id} id={c.id} className="scroll-mt-40">
            <h2 className="text-3xl font-extrabold">{c.emoji} {c.name}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((m) => <MenuCard key={m.id} item={m} />)}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
