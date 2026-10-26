import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { lineKey, useCart } from "@/lib/cart";
import { buildOrderMessage, subtotal, waLink } from "@/lib/whatsapp";
import { site } from "@/data/site";

export function CartSheet() {
  const { lines, open, setOpen, setQty, clear } = useCart();
  const total = subtotal(lines);
  const remaining = site.delivery.minOrder - total;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Your order</SheetTitle>
          <SheetDescription>Review, then send it to us on WhatsApp.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-3 overflow-y-auto px-4">
          {lines.length === 0 && <p className="py-12 text-center text-muted-foreground">Nothing here yet — add something tasty from the menu.</p>}
          {lines.map((l) => {
            const k = lineKey(l);
            return (
              <div key={k} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card">
                <div className="flex-1">
                  <p className="font-semibold leading-tight">{l.name}</p>
                  {l.size && <p className="text-xs text-muted-foreground">{l.size}</p>}
                  <p className="price text-primary">₹{l.price * l.qty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="soft" className="size-8" onClick={() => setQty(k, l.qty - 1)} aria-label="Decrease">
                    {l.qty === 1 ? <Trash2 /> : <Minus />}
                  </Button>
                  <span className="w-6 text-center font-bold">{l.qty}</span>
                  <Button size="icon" variant="soft" className="size-8" onClick={() => setQty(k, l.qty + 1)} aria-label="Increase">
                    <Plus />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {lines.length > 0 && (
          <div className="space-y-3 border-t p-4">
            <div className="flex justify-between text-lg"><span className="font-semibold">Subtotal</span><span className="price">₹{total}</span></div>
            <p className="text-sm text-muted-foreground">
              {remaining > 0 ? `Add ₹${remaining} more for free home delivery.` : "🎉 Free home delivery unlocked (within 3 km)."}
            </p>
            <Button variant="whatsapp" size="xl" className="w-full" asChild>
              <a
                href={waLink(buildOrderMessage(lines))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  const url = waLink(buildOrderMessage(lines));
                  const w = window.open(url, "_blank", "noopener,noreferrer");
                  if (!w) window.top ? (window.top.location.href = url) : (window.location.href = url);
                }}
              >
                Send order on WhatsApp
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">Sending a WhatsApp message doesn't confirm your order — the restaurant will reply to confirm.</p>
            <button onClick={clear} className="text-xs font-semibold text-muted-foreground underline">Clear order</button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
