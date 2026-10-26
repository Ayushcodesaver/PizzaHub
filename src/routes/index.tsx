import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, MessageCircle, Phone, Pizza, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuCard } from "@/components/site/MenuCard";
import { OffersGrid } from "@/components/site/Offers";
import { categories, menu } from "@/data/menu";
import { site, telHref } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import hero from "@/assets/hero-pizza.jpg";
import combo from "@/assets/combo.jpg";
import party from "@/assets/party.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Subday Pizza — Good Times. Great Pizza. | Gurugram" },
      { name: "description", content: "Freshly made pizzas, cheesy burgers, shakes and value combos in Gurugram. Free delivery on ₹399+ within 3 km." },
      { property: "og:title", content: "Subday Pizza — Good Times. Great Pizza." },
      { property: "og:description", content: "Pizzas, burgers, shakes and combos in Gurugram. Order on WhatsApp." },
    ],
  }),
  component: Index,
});

const homeCats = ["classic-veg", "burgers", "sandwiches", "pasta", "fries", "shakes", "mojito", "cold-coffee", "wraps", "garlic-bread"];

function Index() {
  const featured = menu.filter((m) => m.featured);
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-16">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <Sparkles className="size-3.5" /> {site.city}
          </span>
          <h1 className="mt-5 text-5xl font-extrabold leading-[0.95] md:text-7xl">
            Good Times.<br />
            <span className="text-primary">Great Pizza.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Freshly made pizzas, cheesy burgers, delicious shakes and combos made for sharing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="xl" asChild><Link to="/menu">Explore Menu</Link></Button>
            <Button variant="whatsapp" size="xl" asChild>
              <a href={waLink("Hi Subday Pizza! I'd like to place an order.")} target="_blank" rel="noreferrer"><MessageCircle /> Order on WhatsApp</a>
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <li className="flex items-center gap-2"><Pizza className="size-4 text-primary" /> Pizza & Fast Food</li>
            <li className="flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Value-for-Money Combos</li>
            <li className="flex items-center gap-2"><Bike className="size-4 text-primary" /> Home Delivery Available</li>
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.5rem] bg-cheese/40" />
          <img src={hero} alt="Fresh vegetarian pizza with paneer, olives, corn and capsicum" width={1600} height={1200} className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-card" />
          <div className="absolute -bottom-5 left-5 rounded-2xl bg-card px-4 py-3 shadow-card">
            <p className="text-xs font-semibold text-muted-foreground">Pizzas from</p>
            <p className="price text-2xl text-primary">₹100</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-extrabold md:text-4xl">What are you craving?</h2>
        <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5">
          {homeCats.map((id) => {
            const c = categories.find((x) => x.id === id)!;
            return (
              <Link key={id} to="/menu" hash={id} className="flex min-w-32 flex-col items-center gap-2 rounded-3xl bg-card p-5 text-center shadow-card transition-transform hover:-translate-y-1">
                <span className="text-4xl" aria-hidden>{c.emoji}</span>
                <span className="text-sm font-bold">{c.id === "classic-veg" ? "Pizza" : c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Hand-picked</p>
            <h2 className="text-3xl font-extrabold md:text-4xl">Featured Favourites</h2>
          </div>
          <Link to="/menu" className="hidden text-sm font-bold text-primary md:block">Full menu →</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m) => <MenuCard key={m.id} item={m} showCategory />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-extrabold md:text-4xl">Combos made for sharing</h2>
        <div className="mt-8"><OffersGrid /></div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid overflow-hidden rounded-[2rem] bg-charcoal text-cream md:grid-cols-2">
          <div className="p-8 md:p-12">
            <h2 className="text-4xl font-extrabold">Your Pizza Night, Delivered.</h2>
            <p className="mt-4 text-cream/75">Free home delivery on orders of ₹{site.delivery.minOrder} or more, within {site.delivery.radiusKm} km.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="cheese" size="xl" asChild><a href={telHref}><Phone /> Call to Order</a></Button>
              <Button variant="whatsapp" size="xl" asChild><a href={waLink("Hi! I'd like a home delivery.")} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>
            </div>
          </div>
          <img src={combo} alt="Double cheese burger, peri peri fries and Oreo shake" loading="lazy" width={1200} height={912} className="h-full max-h-96 w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2">
        <img src={party} alt="Party hall set for a birthday with pizzas and shakes" loading="lazy" width={1200} height={800} className="rounded-[2rem] object-cover shadow-card" />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Party Hall</p>
          <h2 className="mt-2 text-4xl font-extrabold">Make Every Celebration Delicious.</h2>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[["Food package", site.partyHall.packagePrice], ["Per hour", site.partyHall.hourlyRate], ["3 hours", site.partyHall.threeHourRate]].map(([l, v]) => (
              <div key={l} className="rounded-2xl bg-card p-4 shadow-card">
                <p className="price text-2xl">₹{Number(v).toLocaleString("en-IN")}</p>
                <p className="text-xs font-semibold text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
          <Button variant="hero" size="xl" className="mt-8" asChild><Link to="/party-hall">See party details</Link></Button>
        </div>
      </section>
    </>
  );
}
