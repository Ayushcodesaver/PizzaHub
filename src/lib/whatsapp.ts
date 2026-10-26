import { site } from "@/data/site";

export type CartLine = { id: string; name: string; size?: string; price: number; qty: number };

export const subtotal = (lines: CartLine[]) => lines.reduce((s, l) => s + l.price * l.qty, 0);

export function buildOrderMessage(lines: CartLine[]) {
  const rows = lines.map(
    (l) => `• ${l.qty} x ${l.name}${l.size ? ` (${l.size})` : ""} — ₹${l.price * l.qty}`,
  );
  const total = subtotal(lines);
  const delivery =
    total >= site.delivery.minOrder
      ? "Eligible for free home delivery."
      : `Add ₹${site.delivery.minOrder - total} more for free delivery.`;
  return [`Hi ${site.name}! I'd like to order:`, ...rows, `Subtotal: ₹${total}`, delivery].join("\n");
}

export const waLink = (text: string) =>
  `https://api.whatsapp.com/send?phone=${site.whatsapp}&text=${encodeURIComponent(text)}`;
