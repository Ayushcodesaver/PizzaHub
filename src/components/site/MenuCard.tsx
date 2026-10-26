import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sizesFor, categories, type MenuItem } from "@/data/menu";
import { useCart } from "@/lib/cart";

export function MenuCard({ item, showCategory }: { item: MenuItem; showCategory?: boolean }) {
  const { add } = useCart();
  const sizes = sizesFor(item);
  const [idx, setIdx] = useState(sizes.length ? 1 : 0);
  const available = item.available !== false;
  const cat = categories.find((c) => c.id === item.category);

  return (
    <article className="group flex flex-col rounded-3xl bg-card p-5 shadow-card transition-transform hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl" aria-hidden>{cat?.emoji}</div>
        <div className="flex gap-1">
          {item.featured && <Badge className="rounded-full bg-cheese text-charcoal hover:bg-cheese">Favourite</Badge>}
          <span className="grid size-5 place-items-center rounded-sm border-2 border-veg" title="Vegetarian"><span className="size-2 rounded-full bg-veg" /></span>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-tight">{item.name}</h3>
      {showCategory && <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{cat?.name}</p>}
      {item.note && <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>}

      {sizes.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-secondary p-1" role="radiogroup" aria-label="Size">
          {sizes.map((s, i) => (
            <button
              key={s}
              role="radio"
              aria-checked={i === idx}
              onClick={() => setIdx(i)}
              className={`rounded-full py-1.5 text-xs font-bold transition-colors ${i === idx ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-end justify-between pt-5">
        <span className="price text-2xl">₹{item.prices[idx] ?? item.prices[0] ?? 0}</span>
        <Button
          variant="hero"
          size="sm"
          className="h-10 px-4"
          disabled={!available}
          onClick={() => {
            add({ id: item.id, name: item.name, size: sizes[idx] ?? "", price: item.prices[idx] ?? 0 });
            toast.success(`${item.name} added`);
          }}
        >
          {available ? <><Plus /> Add</> : "Unavailable"}
        </Button>
      </div>
    </article>
  );
}
