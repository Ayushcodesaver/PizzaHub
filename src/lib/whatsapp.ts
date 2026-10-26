import { site } from "@/data/site";

export type CartLine = { id: string; name: string; size?: string; price: number; qty: number };

export const subtotal = (lines: CartLine[]) => lines.reduce((s, l) => s + l.price * l.qty, 0);

export const mapsPinLink = (lat: number, lng: number) =>
  `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;

export function buildOrderMessage(lines: CartLine[], location?: string | null, address?: string | null) {
  const rows = lines.map(
    (l) => `• ${l.qty} x ${l.name}${l.size ? ` (${l.size})` : ""} — ₹${l.price * l.qty}`,
  );
  const total = subtotal(lines);
  const delivery =
    total >= site.delivery.minOrder
      ? "Eligible for free home delivery."
      : `Add ₹${site.delivery.minOrder - total} more for free delivery.`;
  const addr = address?.trim();
  return [
    `Hi ${site.name}! I'd like to order:`,
    ...rows,
    `Subtotal: ₹${total}`,
    delivery,
    ...(addr ? [`🏠 Delivery address: ${addr}`] : []),
    ...(location ? [`📍 Delivery location: ${location}`] : []),
  ].join("\n");
}

export const waLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
