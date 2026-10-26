import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { useSessionUser } from "@/hooks/use-session";

const nav = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/offers", label: "Offers" },
  { to: "/party-hall", label: "Party Hall" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Subday Pizza home">
      <span className="grid size-9 place-items-center rounded-full bg-primary text-lg text-primary-foreground">🍕</span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        Subday<span className="text-primary">Pizza</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { lines, setOpen } = useCart();
  const user = useSessionUser();
  const [mobile, setMobile] = useState(false);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="soft" size="icon" className="size-10" asChild aria-label={user ? "My account" : "Sign in"}>
            <Link to={user ? "/account" : "/auth"}>
              <User />
            </Link>
          </Button>
          <Button variant="soft" size="icon" className="relative size-10" onClick={() => setOpen(true)} aria-label="Open order">
            <ShoppingBag />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
          <Button variant="hero" className="hidden h-10 px-5 sm:inline-flex" asChild>
            <Link to="/menu">Order Now</Link>
          </Button>
          <Sheet open={mobile} onOpenChange={setMobile}>
            <SheetTrigger asChild>
              <Button variant="soft" size="icon" className="size-10 lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-8 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} onClick={() => setMobile(false)} className="rounded-xl px-4 py-3 font-display text-lg font-bold hover:bg-secondary">
                    {n.label}
                  </Link>
                ))}
                <Button variant="hero" size="xl" className="mt-4" asChild>
                  <Link to="/menu" onClick={() => setMobile(false)}>Order Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
