import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { site, telHref } from "@/data/site";
import { Logo } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-charcoal text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <div className="[&_span]:text-cream"><Logo /></div>
          <p className="max-w-sm text-sm text-cream/70">
            Pizzas, burgers, sandwiches, pasta, shakes and combos made for sharing in {site.city}.
          </p>
          <p className="text-sm text-cream/70">
            Free home delivery on orders of ₹{site.delivery.minOrder}+ within {site.delivery.radiusKm} km.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-display text-base font-bold">Explore</h4>
          <Link to="/menu" className="block text-cream/70 hover:text-cream">Menu</Link>
          <Link to="/offers" className="block text-cream/70 hover:text-cream">Offers & Combos</Link>
          <Link to="/party-hall" className="block text-cream/70 hover:text-cream">Party Hall</Link>
          <Link to="/about" className="block text-cream/70 hover:text-cream">About</Link>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-display text-base font-bold">Visit / Call</h4>
          <a href={telHref} className="flex items-center gap-2 text-cream/70 hover:text-cream"><Phone className="size-4" /> {site.phone}</a>
          <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-cream/70 hover:text-cream"><MapPin className="size-4" /> Get directions</a>
          <Link to="/privacy" className="block pt-2 text-cream/70 hover:text-cream">Privacy Policy</Link>
          <Link to="/terms" className="block text-cream/70 hover:text-cream">Terms & Conditions</Link>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
