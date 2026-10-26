import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { menu as staticMenu, offers as staticOffers, deals as staticDeals, type MenuItem } from "@/data/menu";
import { site } from "@/data/site";

export type Offer = { id: string; kind: "combo" | "deal"; title: string; price: number | null; items: string[]; text: string | null; active: boolean; sort: number };
export type PartyHall = { packagePrice: number; hourlyRate: number; threeHourRate: number; packageItems: string[] };

const fallbackOffers: Offer[] = [
  ...staticOffers.map((o, i) => ({ ...o, kind: "combo" as const, text: null, active: true, sort: i })),
  ...staticDeals.map((d, i) => ({ id: d.id, kind: "deal" as const, title: d.title, price: null, items: [], text: d.text, active: true, sort: 10 + i })),
];

export const menuQuery = queryOptions({
  queryKey: ["catalog", "menu"],
  queryFn: async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase.from("menu_items").select("*").order("sort");
    if (error) throw error;
    return data.map((r) => ({ id: r.id, name: r.name, category: r.category, prices: r.prices, note: r.note ?? undefined, featured: r.featured, available: r.available }));
  },
});

export const offersQuery = queryOptions({
  queryKey: ["catalog", "offers"],
  queryFn: async (): Promise<Offer[]> => {
    const { data, error } = await supabase.from("offers").select("*").order("sort");
    if (error) throw error;
    return data as Offer[];
  },
});

export const partyQuery = queryOptions({
  queryKey: ["catalog", "party"],
  queryFn: async (): Promise<PartyHall> => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    if (error) throw error;
    return { packagePrice: data.party_package_price, hourlyRate: data.party_hourly_rate, threeHourRate: data.party_three_hour_rate, packageItems: data.party_package_items };
  },
});

// Public pages show the built-in menu instantly, then switch to the saved one.
export const useMenu = () => useQuery({ ...menuQuery, placeholderData: staticMenu }).data ?? staticMenu;
export const useOffers = () => (useQuery({ ...offersQuery, placeholderData: fallbackOffers }).data ?? fallbackOffers).filter((o) => o.active);
export const usePartyHall = () => useQuery({ ...partyQuery, placeholderData: site.partyHall }).data ?? site.partyHall;
