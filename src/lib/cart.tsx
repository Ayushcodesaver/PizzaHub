import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartLine } from "./whatsapp";

type Cart = {
  lines: CartLine[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (l: Omit<CartLine, "qty">) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<Cart | null>(null);
const keyOf = (l: { id: string; size?: string }) => `${l.id}|${l.size ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("subday-cart");
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("subday-cart", JSON.stringify(lines));
  }, [lines]);

  const add: Cart["add"] = (l) =>
    setLines((prev) => {
      const k = keyOf(l);
      const found = prev.find((p) => keyOf(p) === k);
      return found ? prev.map((p) => (keyOf(p) === k ? { ...p, qty: p.qty + 1 } : p)) : [...prev, { ...l, qty: 1 }];
    });
  const setQty: Cart["setQty"] = (k, qty) =>
    setLines((prev) => (qty <= 0 ? prev.filter((p) => keyOf(p) !== k) : prev.map((p) => (keyOf(p) === k ? { ...p, qty } : p))));

  return (
    <Ctx.Provider value={{ lines, open, setOpen, add, setQty, clear: () => setLines([]) }}>{children}</Ctx.Provider>
  );
}

export const lineKey = keyOf;
export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
