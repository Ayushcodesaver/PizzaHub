import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import combo from "@/assets/combo.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Subday Pizza" },
      { name: "description", content: "Subday Pizza is a local pizza and fast-food spot in Gurugram serving pizzas, burgers, sandwiches, pasta and shakes." },
      { property: "og:title", content: "About Subday Pizza" },
      { property: "og:description", content: "Your local pizza and fast-food destination in Gurugram." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="About us" title="Your neighbourhood pizza spot." />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        <div className="space-y-4 text-lg text-muted-foreground">
          <p>Subday Pizza is a local pizza and fast-food destination in Gurugram. We make pizzas, burgers, sandwiches, pasta, wraps, fries, shakes, mojitos and coffee — plus combo meals that make sharing easy.</p>
          <p>Drop in, order a delivery, or book our party hall for your next celebration.</p>
          <Button variant="hero" size="xl" asChild><Link to="/menu">See the menu</Link></Button>
        </div>
        <img src={combo} alt="Burger, fries and shake" loading="lazy" width={1200} height={912} className="rounded-[2rem] shadow-card" />
      </div>
    </>
  ),
});
