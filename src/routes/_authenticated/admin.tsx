import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MapPin, Phone, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories } from "@/data/menu";
import { menuQuery, offersQuery, partyQuery, type Offer } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Subday Pizza" },
      { name: "description", content: "Manage menu, offers, party hall pricing and orders." },
      { property: "og:title", content: "Admin — Subday Pizza" },
      { property: "og:description", content: "Restaurant admin panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const role = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      return !!data;
    },
  });
  if (role.isLoading) return <p className="py-20 text-center text-muted-foreground">Checking access…</p>;
  if (!role.data)
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h1 className="text-3xl font-extrabold">Admins only</h1>
        <p className="mt-2 text-muted-foreground">This account doesn't have admin access.</p>
        <Button variant="hero" className="mt-6" asChild><Link to="/">Go home</Link></Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">Admin panel</h1>
      <Tabs defaultValue="orders" className="mt-6">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="party">Party hall</TabsTrigger>
        </TabsList>
        <TabsContent value="orders"><OrdersTab /></TabsContent>
        <TabsContent value="menu"><MenuTab /></TabsContent>
        <TabsContent value="offers"><OffersTab /></TabsContent>
        <TabsContent value="party"><PartyTab /></TabsContent>
      </Tabs>
    </div>
  );
}

type OrderLine = { name: string; size?: string; price: number; qty: number };
const STATUSES = ["new", "confirmed", "delivered", "cancelled"];

function OrdersTab() {
  const qc = useQueryClient();
  const orders = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });
  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error("Couldn't update order");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };
  if (orders.isLoading) return <p className="py-10 text-muted-foreground">Loading orders…</p>;
  if (!orders.data?.length) return <p className="py-10 text-muted-foreground">No orders yet. Orders appear here when customers tap “Send order on WhatsApp”.</p>;
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {orders.data.map((o) => (
        <article key={o.id} className="rounded-3xl bg-card p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold">{o.customer_name || "Customer"}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</p>
            </div>
            <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="rounded-full border bg-background px-3 py-1 text-sm font-semibold" aria-label="Order status">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {(o.items as OrderLine[]).map((l, i) => (
              <li key={i}>{l.qty} × {l.name}{l.size ? ` (${l.size})` : ""} — ₹{l.price * l.qty}</li>
            ))}
          </ul>
          <p className="price mt-2 text-lg text-primary">₹{o.subtotal}</p>
          <div className="mt-3 space-y-1 text-sm">
            {o.phone && <a href={`tel:${o.phone}`} className="flex items-center gap-2 font-semibold"><Phone className="size-4" />{o.phone}</a>}
            <p><span className="font-semibold">Address:</span> {o.address || <span className="text-muted-foreground">not given</span>}</p>
            {o.location && <a href={o.location} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold text-primary"><MapPin className="size-4" />Open map pin</a>}
          </div>
        </article>
      ))}
    </div>
  );
}

function MenuTab() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(menuQuery);
  const [cat, setCat] = useState(categories[0].id);
  const items = data.filter((m) => m.category === cat);
  const refresh = () => qc.invalidateQueries({ queryKey: ["catalog", "menu"] });

  const save = async (id: string, patch: Record<string, unknown>) => {
    const { error } = await supabase.from("menu_items").update(patch).eq("id", id);
    if (error) toast.error("Couldn't save"); else { toast.success("Saved"); refresh(); }
  };
  const add = async () => {
    const name = prompt("New item name");
    if (!name?.trim()) return;
    const sized = !!categories.find((c) => c.id === cat)?.sizes;
    const { error } = await supabase.from("menu_items").insert({
      id: `${cat}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`,
      name: name.trim(), category: cat, prices: sized ? [0, 0, 0] : [0], sort: data.length,
    });
    if (error) toast.error("Couldn't add"); else refresh();
  };
  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) toast.error("Couldn't delete"); else refresh();
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-full border bg-background px-4 font-semibold" aria-label="Category">
          {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
        </select>
        <Button variant="hero" onClick={add}><Plus /> Add item</Button>
      </div>
      {items.map((m) => <MenuRow key={m.id} item={m} sizes={categories.find((c) => c.id === cat)?.sizes} onSave={(p) => save(m.id, p)} onDelete={() => remove(m.id, m.name)} />)}
    </div>
  );
}

function MenuRow({ item, sizes, onSave, onDelete }: { item: { name: string; prices: number[]; note?: string; featured?: boolean; available?: boolean }; sizes?: string[]; onSave: (p: Record<string, unknown>) => void; onDelete: () => void }) {
  const [name, setName] = useState(item.name);
  const [prices, setPrices] = useState(item.prices.map(String));
  const [note, setNote] = useState(item.note ?? "");
  useEffect(() => { setName(item.name); setPrices(item.prices.map(String)); setNote(item.note ?? ""); }, [item]);
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-card p-4 shadow-card">
      <label className="flex-1 min-w-48 text-xs font-semibold">Name<Input value={name} onChange={(e) => setName(e.target.value)} /></label>
      {prices.map((p, i) => (
        <label key={i} className="w-24 text-xs font-semibold">{prices.length > 1 ? sizes?.[i] ?? `Size ${i + 1}` : "Price"} ₹
          <Input type="number" min={0} value={p} onChange={(e) => setPrices(prices.map((x, j) => (j === i ? e.target.value : x)))} />
        </label>
      ))}
      <label className="min-w-40 flex-1 text-xs font-semibold">Note<Input value={note} onChange={(e) => setNote(e.target.value)} /></label>
      <label className="flex items-center gap-2 text-xs font-semibold"><Switch checked={item.available !== false} onCheckedChange={(v) => onSave({ available: v })} />Available</label>
      <label className="flex items-center gap-2 text-xs font-semibold"><Switch checked={!!item.featured} onCheckedChange={(v) => onSave({ featured: v })} />Favourite</label>
      <Button onClick={() => onSave({ name: name.trim(), note: note.trim() || null, prices: prices.map((x) => Math.max(0, Math.round(Number(x) || 0))) })}>Save</Button>
      <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete item"><Trash2 /></Button>
    </div>
  );
}

function OffersTab() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(offersQuery);
  const refresh = () => qc.invalidateQueries({ queryKey: ["catalog", "offers"] });
  const add = async (kind: "combo" | "deal") => {
    const { error } = await supabase.from("offers").insert({ id: `${kind}-${Date.now().toString(36)}`, kind, title: kind === "combo" ? "New combo" : "New offer", price: kind === "combo" ? 0 : null, sort: data.length + 20 });
    if (error) toast.error("Couldn't add"); else refresh();
  };
  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-3">
        <Button variant="hero" onClick={() => add("combo")}><Plus /> Add combo</Button>
        <Button variant="soft" onClick={() => add("deal")}><Plus /> Add offer</Button>
      </div>
      {data.map((o) => <OfferRow key={o.id} offer={o} onDone={refresh} />)}
    </div>
  );
}

function OfferRow({ offer, onDone }: { offer: Offer; onDone: () => void }) {
  const [title, setTitle] = useState(offer.title);
  const [price, setPrice] = useState(String(offer.price ?? ""));
  const [body, setBody] = useState(offer.kind === "combo" ? offer.items.join("\n") : offer.text ?? "");
  useEffect(() => { setTitle(offer.title); setPrice(String(offer.price ?? "")); setBody(offer.kind === "combo" ? offer.items.join("\n") : offer.text ?? ""); }, [offer]);
  const update = async (patch: Record<string, unknown>) => {
    const { error } = await supabase.from("offers").update(patch).eq("id", offer.id);
    if (error) toast.error("Couldn't save"); else { toast.success("Saved"); onDone(); }
  };
  const save = () =>
    update(offer.kind === "combo"
      ? { title: title.trim(), price: Math.max(0, Math.round(Number(price) || 0)), items: body.split("\n").map((s) => s.trim()).filter(Boolean) }
      : { title: title.trim(), text: body.trim() });
  const remove = async () => {
    if (!confirm(`Delete ${offer.title}?`)) return;
    const { error } = await supabase.from("offers").delete().eq("id", offer.id);
    if (error) toast.error("Couldn't delete"); else onDone();
  };
  return (
    <div className="grid gap-3 rounded-2xl bg-card p-4 shadow-card md:grid-cols-[1fr_8rem_2fr_auto]">
      <label className="text-xs font-semibold">{offer.kind === "combo" ? "Combo" : "Offer"} title<Input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      {offer.kind === "combo" ? <label className="text-xs font-semibold">Price ₹<Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} /></label> : <span />}
      <label className="text-xs font-semibold">{offer.kind === "combo" ? "Items (one per line)" : "Description"}<Textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} /></label>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs font-semibold"><Switch checked={offer.active} onCheckedChange={(v) => update({ active: v })} />Show</label>
        <Button onClick={save}>Save</Button>
        <Button variant="ghost" size="sm" onClick={remove}><Trash2 /> Delete</Button>
      </div>
    </div>
  );
}

function PartyTab() {
  const qc = useQueryClient();
  const { data } = useQuery(partyQuery);
  const [f, setF] = useState({ pkg: "", hr: "", three: "", items: "" });
  useEffect(() => {
    if (data) setF({ pkg: String(data.packagePrice), hr: String(data.hourlyRate), three: String(data.threeHourRate), items: data.packageItems.join("\n") });
  }, [data]);
  const n = (s: string) => Math.max(0, Math.round(Number(s) || 0));
  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      party_package_price: n(f.pkg), party_hourly_rate: n(f.hr), party_three_hour_rate: n(f.three),
      party_package_items: f.items.split("\n").map((s) => s.trim()).filter(Boolean),
    }).eq("id", 1);
    if (error) return toast.error("Couldn't save");
    toast.success("Party hall pricing saved");
    qc.invalidateQueries({ queryKey: ["catalog", "party"] });
  };
  return (
    <div className="mt-4 max-w-xl space-y-4 rounded-3xl bg-card p-6 shadow-card">
      <div className="grid grid-cols-3 gap-3">
        <label className="text-xs font-semibold">Food package ₹<Input type="number" value={f.pkg} onChange={(e) => setF({ ...f, pkg: e.target.value })} /></label>
        <label className="text-xs font-semibold">Hall per hour ₹<Input type="number" value={f.hr} onChange={(e) => setF({ ...f, hr: e.target.value })} /></label>
        <label className="text-xs font-semibold">3 hours ₹<Input type="number" value={f.three} onChange={(e) => setF({ ...f, three: e.target.value })} /></label>
      </div>
      <label className="block text-xs font-semibold">Package includes (one per line)<Textarea rows={7} value={f.items} onChange={(e) => setF({ ...f, items: e.target.value })} /></label>
      <Button variant="hero" onClick={save}>Save</Button>
    </div>
  );
}
