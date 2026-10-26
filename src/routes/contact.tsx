import { createFileRoute } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { site, telHref } from "@/data/site";
import { waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — Subday Pizza Gurugram" },
      { name: "description", content: "Call Subday Pizza on 8796130029, order on WhatsApp or get directions in Gurugram." },
      { property: "og:title", content: "Contact Subday Pizza" },
      { property: "og:description", content: "Call, WhatsApp or find us on Google Maps." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Contact" title="Hungry? Let's talk." />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-3">
        {[
          { icon: Phone, t: "Call restaurant", d: site.phone, href: telHref, v: "hero" as const, b: "Call now" },
          { icon: MessageCircle, t: "WhatsApp order", d: "Send us your order", href: waLink("Hi Subday Pizza!"), v: "whatsapp" as const, b: "Open WhatsApp" },
          { icon: MapPin, t: "Find us", d: site.city, href: site.mapsUrl, v: "cheese" as const, b: "Get directions" },
        ].map(({ icon: I, t, d, href, v, b }) => (
          <div key={t} className="flex flex-col rounded-3xl bg-card p-7 shadow-card">
            <I className="size-8 text-primary" />
            <h2 className="mt-4 text-xl font-extrabold">{t}</h2>
            <p className="text-muted-foreground">{d}</p>
            <Button variant={v} size="xl" className="mt-6" asChild>
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{b}</a>
            </Button>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-6xl px-4 text-sm text-muted-foreground">
        Free home delivery on orders of ₹{site.delivery.minOrder}+ within {site.delivery.radiusKm} km.
      </p>
    </>
  ),
});
