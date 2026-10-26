import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(20).optional(),
  address: z.string().trim().max(300).optional(),
  location: z.string().trim().max(200).nullable().optional(),
  lines: z
    .array(z.object({ id: z.string().max(120), name: z.string().max(120), size: z.string().max(30).optional(), price: z.number().int().min(0).max(100000), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(60),
});

// Public: customers place orders without signing in. Only inserts; nothing is read back.
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const subtotal = data.lines.reduce((s, l) => s + l.price * l.qty, 0);
    const { error } = await supabaseAdmin.from("orders").insert({
      customer_name: data.name || null,
      phone: data.phone || null,
      address: data.address || null,
      location: data.location || null,
      items: data.lines,
      subtotal,
    });
    if (error) {
      console.error("placeOrder", error);
      return { ok: false };
    }
    return { ok: true };
  });
