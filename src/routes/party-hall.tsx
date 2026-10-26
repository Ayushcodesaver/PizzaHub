import { createFileRoute } from "@tanstack/react-router";
import { Check, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { site, telHref } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import party from "@/assets/party.jpg";

export const Route = createFileRoute("/party-hall")({
  head: () => ({
    meta: [
      { title: "Party Hall — Subday Pizza Gurugram" },
      { name: "description", content: "Book the Subday Pizza party hall: ₹400/hour, ₹1,000 for 3 hours, party food package ₹1,500." },
      { property: "og:title", content: "Subday Pizza Party Hall" },
      { property: "og:description", content: "Birthdays and get-togethers with pizza, burgers and shakes." },
    ],
  }),
  component: PartyHall,
});

function PartyHall() {
  const p = site.partyHall;
  return (
    <>
      <PageHeader eyebrow="Party hall" title="Make Every Celebration Delicious.">
        Birthdays, kitty parties or get-togethers — bring the people, we'll bring the food.
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
        <img src={party} alt="Party hall decorated with balloons and food" width={1200} height={800} className="rounded-[2rem] object-cover shadow-card" />
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[["Hall / hour", p.hourlyRate], ["3 hours", p.threeHourRate], ["Food package", p.packagePrice]].map(([l, v]) => (
              <div key={l} className="rounded-2xl bg-card p-4 shadow-card">
                <p className="price text-2xl">₹{Number(v).toLocaleString("en-IN")}</p>
                <p className="text-xs font-semibold text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-xl font-extrabold">₹{p.packagePrice.toLocaleString("en-IN")} party package includes</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {p.packageItems.map((i) => <li key={i} className="flex gap-2 text-sm"><Check className="size-4 text-primary" />{i}</li>)}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="whatsapp" size="xl" asChild>
              <a href={waLink("Hi Subday Pizza! I'd like to enquire about booking the party hall. Date: ___  Guests: ___")} target="_blank" rel="noreferrer"><MessageCircle /> Enquire About Party Hall</a>
            </Button>
            <Button variant="soft" size="xl" asChild><a href={telHref}><Phone /> Call us</a></Button>
          </div>
          <p className="text-sm text-muted-foreground">Rates as advertised on our menu — please confirm availability and current pricing when enquiring.</p>
        </div>
      </div>
    </>
  );
}
